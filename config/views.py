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
from rest_framework_jwt.settings import api_settings
from config.utils import CustomSchema, send_fcm
from api.models import *
from api.views import getSerializer
from datetime import datetime
from dateutil.relativedelta import relativedelta
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

@permission_classes((AllowAny,))
@authentication_classes((JSONWebTokenAuthentication,))
class SocialSiginViewSet(viewsets.ViewSet):
    def create(self, request, *args, **kwargs):
        sns = request.data['sns']
        uid = request.data['uid']
        token = request.data['token']
        name = request.data['name']
        email = request.data['email'] if 'email' in request.data else sns + '@' + uid
        username = email
        if sns == 'google':
            r = requests.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json',headers={
                'Authorization': 'Bearer '+token})
        elif sns == 'facebook':
            r = requests.get('https://graph.facebook.com/v6.0/me/?access_token='+token)
        elif sns == 'naver':
            r = requests.get('https://openapi.naver.com/v1/nid/me', headers={
                'Authorization':'Bearer '+token})
        elif sns == 'kakao':
            r = requests.get('https://kapi.kakao.com/v2/user/me',headers={
                'Authorization':'Bearer '+token})
        if r.status_code != 200:
            return Response({'message':'fail to authenticate'}, status=status.HTTP_401_UNAUTHORIZED)
        user = User.objects.filter(username=username)
        if user.count() == 0:
            user = User(username=username)
            password = User.objects.make_random_password()
            user.set_password(password)
            user.is_active = True
            user.save()
            profile = Profile(user=user, name=name)
            profile.save()
        user = User.objects.get(username=username)
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        serializer = getSerializer(Profile)
        refresh_token = None
        fcm_token = 'noToken'
        if 'fcm_token' in request.data:
            fcm_token = request.data['fcm_token']
        if 'type' in request.data:
            type = request.data['type']
            devices = user.profile.device_set.filter(type=type)
            if devices.count() > 0:
                device = devices[0]
                device.fcm_token = fcm_token
                device.refresh_token = User.objects.make_random_password(length=20)
                device.save()
            else:
                device = Device(fcm_token=fcm_token,
                    profile=user.profile,
                    refresh_token=User.objects.make_random_password(length=20),
                    type=type)
                device.save()
            refresh_token = device.refresh_token
        return Response({
            'token':token, 
            'profile':serializer(user.profile).data,
            'refresh_token':refresh_token
        }, status=status.HTTP_200_OK)

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

@permission_classes((AllowAny,))
@authentication_classes((JSONWebTokenAuthentication,))
class TokenRefreshViewSet(viewsets.ViewSet):
    def create(self, request):
        refresh_token = request.data['refresh_token']
        devices = Device.objects.filter(refresh_token=refresh_token)
        if devices.count() > 0:
            device = devices[0]
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            payload = jwt_payload_handler(device.profile.user)
            token = jwt_encode_handler(payload)
            return Response({'token':token}, status=status.HTTP_200_OK)
        return Response({'message':'invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
@permission_classes((IsAuthenticatedOrReadOnly,))
@authentication_classes((JSONWebTokenAuthentication,))
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

def index(request):
    # contents = cache.get(request.path)
    # if not contents:
    contents = requests.get(settings.REACT_HOST+request.path).text
        # cache.set(request.path, contents)
    contents = contents.replace('{% csrf_token %}', get_token(request))
    return HttpResponse(contents)

def assets(request):
    response = requests.get(settings.REACT_HOST+request.path, stream=True)
    return HttpResponse(
        content=response.content,
        status=response.status_code,
        content_type=response.headers['Content-Type']
    )

# For CKEditor uploader  
@permission_classes((AllowAny,))
@authentication_classes((JSONWebTokenAuthentication,))
class UploadViewset(viewsets.ViewSet):

    def create(self, request):
        filename = ''.join([random.choice(string.ascii_letters) for i in range(20)])
        ext = os.path.splitext(request.data['upload'].name)[-1]
        path = str(urllib.parse.urlparse(request.META['HTTP_REFERER']).path)
        request.data['upload'].name = filename+ext
        m = Media(file=request.data['upload'])
        if path.find('/board/write') == 0:
            m.boarditem = BoardItem.objects.get(pk=int(path.split('/')[-1]))
        elif path.find('/mypage') == 0:
            profile = Profile.objects.get(user=request.user)
            profile.media_set.all().delete()
            m.profile = profile
        m.save()
        return Response({
            'uploaded':True,
            'url':'/media/'+str(m.file)
        }, status=status.HTTP_200_OK)


# For Iamport
@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
class PaymentValidator(viewsets.ViewSet):

    def create(self, request):
        body = json.loads(request.body)
        token = get_imp_token()
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

@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
class Billings(viewsets.ViewSet):

    def create(self, request):
        body = json.loads(request.body)
        token = get_imp_token()
        if body['type'] == 'subscribe':
            card = ShopCard.objects.get(pk=body['card_id'])
            subscription = ShopSubscription.objects.get(pk=body['subscription_id'])
            merchant_uid = 'order_'+str(int(datetime.now().timestamp()))
            payment = json.loads(requests.post('https://api.iamport.kr/subscribe/payments/again',
                headers={
                    'Authorization':token['response']['access_token'],
                    'Content-Type':'application/json'
                },
                data=json.dumps({
                    'customer_uid':card.customer_uid,
                    'merchant_uid':merchant_uid,
                    'amount':subscription.price,
                    'name':subscription.name,
                    'buyer_name':card.buyer_name,
                    'buyer_email':card.buyer_email,
                    'buyer_tel':card.buyer_tel
                })
            ).text)
            if payment['code'] == 0:
                if payment['response']['status'] == 'paid':
                    billing = ShopBilling(
                        profile=card.profile,
                        subscription=subscription,
                        card=card,
                        expired=datetime.now() + relativedelta(months=1),
                        imp_uid=payment['response']['imp_uid'],
                        merchant_uid=merchant_uid
                    )
                    billing.save()
                    schedule_billing(token, payment['response']['imp_uid'])
                else:
                    return Response({'message':'결제실패'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message':'결제실패'}, status=status.HTTP_400_BAD_REQUEST)
        elif body['type'] == 'unsubscribe':
            billing = ShopBilling.objects.get(pk=body['billing_id'])
            res = json.loads(requests.post('https://api.iamport.kr/subscribe/payments/unschedule',
                headers={
                    'Authorization':token['response']['access_token'],
                    'Content-Type':'application/json'
                },
                data=json.dumps({
                    'customer_uid':billing.card.customer_uid,
                    'merchant_uid':[billing.merchant_uid]
                })
            ).text)
            billing.scheduled = False
            billing.save()
        elif body['type'] == 'expand':
            schedule_billing(token, body['imp_uid'], for_expand=True)
        elif body['type'] == 'deleteCard':
            card = ShopCard.objects.get(pk=body['card_id'])
            billings = card.shopbilling_set.filter(scheduled=True)
            merchant_uids = []
            for billing in billings:
                billing.scheduled = False
                merchant_uids.append(billing.merchant_uid)
                billing.save()
            res = json.loads(requests.post('https://api.iamport.kr/subscribe/payments/unschedule',
                headers={
                    'Authorization':token['response']['access_token'],
                    'Content-Type':'application/json'
                },
                data=json.dumps({
                    'customer_uid':card.customer_uid,
                    'merchant_uid':merchant_uids
                })
            ).text)
            print(res)
        return Response({}, status=status.HTTP_200_OK)

def schedule_billing(token, imp_uid, for_expand=False):
    billing = ShopBilling.objects.get(imp_uid=imp_uid)
    if for_expand:
        schedule_at = billing.expired
    else:
        schedule_at = datetime.now() + relativedelta(months=1)
    merchant_uid = 'schdule_'+str(int(datetime.now().timestamp()))
    next_pay = json.loads(requests.post('https://api.iamport.kr/subscribe/payments/schedule',
        headers={
            'Authorization':token['response']['access_token'],
            'Content-Type':'application/json'
        },
        data=json.dumps({
            'customer_uid':billing.card.customer_uid,
            'schedules':[{
                'merchant_uid':merchant_uid,
                'schedule_at':int(schedule_at.timestamp()),
                'amount':billing.subscription.price,
                'name':billing.subscription.name,
                'buyer_name':billing.card.buyer_name,
                'buyer_email':billing.card.buyer_email,
                'buyer_tel':billing.card.buyer_tel
            }]
        })
    ).text)
    if next_pay['code'] == 0:
        billing.merchant_uid = merchant_uid
        billing.expired = schedule_at
        billing.scheduled = True
        billing.save()

def get_imp_token():
    return json.loads(requests.post('https://api.iamport.kr/users/getToken',
        headers={'Content-Type':'application/json'}, 
        data=json.dumps({
            'imp_key':settings.IMP_REST_API_KEY,
            'imp_secret':settings.IMP_REST_API_SECRET
        })).text)

@permission_classes((AllowAny,))
class IamportWebhook(viewsets.ViewSet):

    def create(self, request):
        body = json.loads(request.body)
        out = {}
        billings = ShopBilling.objects.filter(merchant_uid=body['merchant_uid'])
        if billings.count() > 0:
            billing = billings[0]
            token = get_imp_token()
            payment = json.loads(requests.get('https://api.iamport.kr/payments/'+body['imp_uid'],
                headers={'Authorization':token['response']['access_token']}).text)
            if payment['response']['status'] == 'paid':
                schedule_billing(token, billing.imp_uid)
                out['message'] = 'rescheduled'
            else:
                billing.scheduled = False
                billing.save()
                out['message'] = 'fail rescheduled'
        elif body['status'] == 'paid' or body['status'] == 'cancelled':
            payments = ShopPayment.objects.filter(imp_uid=body['imp_uid'])
            if payments.count() > 0:
                payment = payments[0]
                payment.status = body['status']
                payment.save()
                out['message'] = 'payment update'
        return Response(out, status=status.HTTP_200_OK)


@permission_classes((IsAuthenticated,))
@authentication_classes((JSONWebTokenAuthentication,))
class FcmSender(viewsets.ViewSet):
    
    def create(self, request):
        body = json.loads(request.body)
        profile = Profile.objects.get(pk=body['profile_id'])
        for device in profile.device_set.all():
            send_fcm(device, body['notification'], body['data'])
        return Response({}, status=status.HTTP_200_OK)


# For FCM
@csrf_exempt
def fcm_test(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        time.sleep(3)
        send_fcm(body['token'], data=body['data'])
    return HttpResponse(json.dumps({'msg':'ok'}))