from django.shortcuts import HttpResponse, render, HttpResponseRedirect
from django.conf import settings
from django.contrib.auth.models import User, Group
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.core.cache import cache
from django.core.mail import EmailMessage
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.middleware.csrf import get_token
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_text
from django.utils import six
from rest_framework import viewsets, status
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.utils.serializer_helpers import ReturnDict
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from config.utils import CustomSchema, send_fcm
from api.models import Profile, Media, BoardItem, ShopPayment, ShopCart, ShopProduct
from datetime import datetime
import requests
import coreapi
import json
import time
import random
import string
import os
import urllib.parse

class UserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'groups', 'password', 'is_staff', 'is_active', 'date_joined', 'last_login', 'is_superuser', 'user_permissions')
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
        )
        if 'email' in validated_data: user.email = validated_data['email']
        if 'groups' in validated_data: user.groups = validated_data['groups']
        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()
        return user

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')

class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        if type(user) == ReturnDict:
            return (six.text_type(user['id']) + six.text_type(timestamp)) +  six.text_type(user['is_active'])
        else:
            return (six.text_type(user.pk) + six.text_type(timestamp)) +  six.text_type(user.is_active)
account_activation_token = AccountActivationTokenGenerator()

class AccountResetTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (six.text_type(user.pk) + six.text_type(timestamp) + six.text_type(user.last_login))
account_reset_token = AccountResetTokenGenerator()
@permission_classes((AllowAny,))
@authentication_classes((JSONWebTokenAuthentication,))
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    schema = CustomSchema({
        'list': [
            coreapi.Field('self', required=False, location='query', type='string', description='get auth user data')
        ]
    })

    def list(self, request):
        username = request.GET.get('username')
        email = request.GET.get('email')
        if request.GET.get('self') == 'true':
            if request.user.is_authenticated:
                serializer = self.serializer_class(request.user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        elif username:
            out = {'username':False, 'email':False}
            if User.objects.filter(username=username).count() > 0:
                out['username'] = True
            if email and User.objects.filter(email=email).count() > 0:
                out['email'] = True
            return Response(out, status=status.HTTP_200_OK)
        serializers = self.serializer_class(self.queryset, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

    def create(self, request):
        response = super().create(request)
        current_site = get_current_site(request)

        message = render_to_string('account/user_activate_email.html', {
            'user':response.data,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(response.data['id'])).encode().decode(),
            'token': account_activation_token.make_token(response.data)
        })
        email = EmailMessage('Activation Mail', message, to=[response.data['email']])
        email.send()
        return response

    def update(self, request, pk): 
        if pk == '0':# for social
            sns = request.data['sns']
            uid = request.data['uid']
            token = request.data['token']
            name = request.data['name']
            username = sns + '@' + uid
            user = User.objects.filter(username=username)
            if user.count() > 0:
                user = user[0]
                user.set_password(token)
                user.save()
            else:
                user = User(username=username)
                user.set_password(token)
                user.is_active = True
                user.save()
                profile = Profile(user=user, name=name)
                profile.save()
            return Response({}, status=status.HTTP_200_OK)
        else:
            return super().update(request, pk)

def activate(request, uid64, token):
    uid = force_text(urlsafe_base64_decode(uid64))
    user = User.objects.get(pk=uid)
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        profile = Profile(user=user, name=user.username)
        profile.save()
        return HttpResponseRedirect('/activation')
    else:
        return HttpResponse('invalid access')

def send_reset_mail(request):
    if request.method == 'GET':
        email = request.GET.get('email')
        if email:
            current_site = get_current_site(request)
            user = User.objects.get(email=email)
            message = render_to_string('account/password_reset_email.html',{
                'user':user,
                'domain':current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)).encode().decode(),
                'token': account_reset_token.make_token(user)
            })
            email = EmailMessage('Password Reset Mail', message, to=[email])
            email.send()
            return HttpResponse('ok')
    elif request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        uid = force_text(urlsafe_base64_decode(body['uid']))
        user = User.objects.get(pk=uid)
        if user is not None and account_reset_token.check_token(user, body['token']):
            user.set_password(body['password'])
            user.save()
            return HttpResponse('ok')
    return HttpResponse('Unauthorized', status=401)

@permission_classes((IsAuthenticatedOrReadOnly,))
@authentication_classes((JSONWebTokenAuthentication,))
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

def index(request):
    contents = cache.get(request.path)
    if not contents:
        contents = requests.get(settings.REACT_HOST+request.path).text
        cache.set(request.path, contents)
    contents = contents.replace('{% csrf_token %}', get_token(request))
    return HttpResponse(contents)

def assets(request):
    response = requests.get(settings.REACT_HOST+request.path, stream=True)
    return HttpResponse(
        content=response.content,
        status=response.status_code,
        content_type=response.headers['Content-Type']
    )
    
@permission_classes((AllowAny,))
@authentication_classes((JSONWebTokenAuthentication,))
class UploadViewset(viewsets.ViewSet):

    def create(self, request):
        filename = ''.join([random.choice(string.ascii_letters) for i in range(20)])
        ext = os.path.splitext(request.data['upload'].name)[-1]
        path = os.path.split(urllib.parse.urlparse(request.META['HTTP_REFERER']).path)
        request.data['upload'].name = filename+ext
        m = Media(file=request.data['upload'])
        if path[0] == '/board/write':
            m.boarditem = BoardItem.objects.get(pk=int(path[1]))
        m.save()
        return Response({
            'uploaded':True,
            'url':'/media/'+str(m.file)
        }, status=status.HTTP_200_OK)

@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
class PaymentValidator(viewsets.ViewSet):

    def create(self, request):
        body = json.loads(request.body)
        token = json.loads(requests.post('https://api.iamport.kr/users/getToken',
            headers={'Content-Type':'application/json'}, 
            params={},
            data=json.dumps({
                'imp_key':settings.IMP_REST_API_KEY,
                'imp_secret':settings.IMP_REST_API_SECRET
            })).text)
        payment = json.loads(requests.get('https://api.iamport.kr/payments/'+body['imp_uid'],
            headers={'Authorization':token['response']['access_token']}).text)
        amount = 0
        if body['type'] == 'cart':
            cart = ShopCart.objects.get(pk=body['id'])
            for product in cart.product.all():
                amount += product.price
        elif body['type'] == 'payment':
            product = ShopProduct.objects.get(pk=body['id'])
            amount = product.price
        if amount != payment['response']['amount']:
            return Response({'message':'위조된 요청'}, status=status.HTTP_401_UNAUTHORIZED)
        objs = ShopPayment.objects.filter(imp_uid=body['imp_uid'])
        if objs.count() > 0:
            shopapyment = objs[0]
            return Response({'pk':shopapyment.pk, 'status':shopapyment.status}, status=status.HTTP_200_OK)
        shopapyment = ShopPayment(
            imp_uid=body['imp_uid'],
            status=payment['response']['status'])
        if payment['response']['status'] == 'ready':
            res = payment['response']
            expired = datetime.utcfromtimestamp(int(res['vbank_date']))
            vbank = '%s %s %s'%(res['vbank_num'], res['vbank_name'], expired.strftime('%Y.%m.%d까지'))
            shopapyment.vbank = vbank
        shopapyment.save()
        return Response({'pk':shopapyment.pk, 'status':shopapyment.status}, status=status.HTTP_200_OK)

@permission_classes((AllowAny,))
class IamportWebhook(viewsets.ViewSet):

    def create(self, request):
        body = json.loads(request.body)
        if body['status'] == 'paid' or body['status'] == 'cancelled':
            payment = ShopPayment.objects.get(imp_uid=body['imp_uid'])
            payment.status = body['status']
            payment.save()
        return Response({}, status=status.HTTP_200_OK)

@csrf_exempt
def fcm_test(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        time.sleep(3)
        send_fcm(body['token'], data=body['data'])
    return HttpResponse(json.dumps({'msg':'ok'}))