from django.shortcuts import HttpResponse, render
from django.contrib.auth.models import User, Group
from django.middleware.csrf import get_token
from rest_framework import viewsets, status
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.conf import settings
from servicestarter.utils import CustomSchema
import requests
import coreapi

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
        user.save()
        return user

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')


@permission_classes((AllowAny,))
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    schema = CustomSchema({
        'list': [
            coreapi.Field('self', required=False, location='query', type='string', description='get auth user data')
        ]
    })

    def list(self, request):
        if request.GET.get('self') == 'true':
            if request.user.is_authenticated:
                serializer = self.serializer_class(request.user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializers = self.serializer_class(self.queryset, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

@permission_classes((IsAuthenticatedOrReadOnly,))
@authentication_classes((JSONWebTokenAuthentication,))
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

def index(request):
    contents = requests.get(settings.REACT_HOST+request.path).text
    contents = contents.replace('{% csrf_token %}', get_token(request))
    return HttpResponse(contents)
