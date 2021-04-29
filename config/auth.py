from django.contrib.auth.models import update_last_login, User
from rest_framework_jwt.views import ObtainJSONWebToken, RefreshJSONWebToken
from rest_framework_jwt.settings import api_settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from api.models import Profile

class ObtainAuthToken(ObtainJSONWebToken):

    def post(self, request):
        result = super().post(request)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.object.get('user')
            update_last_login(None, user)
            try:
                user.profile.auth_token = result.data['token']
                user.profile.save()
            except User.profile.RelatedObjectDoesNotExist:
                Profile.objects.create(name=user.username, user=user, auth_token=result.data['token'])
        return result

class RefreshAuthToken(RefreshJSONWebToken):

    def post(self, request):
        profile = Profile.objects.filter(auth_token=request.data['token'])
        if profile.count() > 0:
            profile = profile[0]
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            payload = jwt_payload_handler(profile.user)
            token = jwt_encode_handler(payload)
            profile.auth_token = token
            profile.save()
            return Response({'token':token}, status=status.HTTP_200_OK)
        else:
            return Response({'message':'invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
    
@permission_classes((AllowAny,)) 
class SocialSiginViewSet(viewsets.ViewSet):
    def create(self, request, *args, **kwargs):
        sns = request.data['sns']
        uid = request.data['uid']
        token = request.data['token']
        name = request.data['name']
        username = request.data['email'] if 'email' in request.data else sns + '@' + uid
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
        user.profile.auth_token = token
        user.profile.save()
        serializer = getSerializer(Profile)
        fcm_token = 'noToken'
        if 'fcm_token' in request.data:
            fcm_token = request.data['fcm_token']
        if 'type' in request.data:
            type = request.data['type']
            devices = user.profile.device_set.filter(type=type)
            if devices.count() > 0:
                device = devices[0]
                device.fcm_token = fcm_token
                device.save()
            else:
                device = Device(fcm_token=fcm_token,
                    profile=user.profile,
                    type=type)
                device.save()
        return Response({
            'token':token, 
            'profile':serializer(user.profile).data
        }, status=status.HTTP_200_OK)