from django.shortcuts import HttpResponse, render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import serializers
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

class UserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'groups', 'password')
    
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

@permission_classes((IsAuthenticatedOrReadOnly,))
@authentication_classes((JSONWebTokenAuthentication,))
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

def index(request):
  return render(request, 'index.html')

def favicon(request):
  favicon = open('react/build/favicon.ico', 'rb').read()
  return HttpResponse(favicon, content_type="image/png")

def manifest(request):
  return render(request, 'manifest.json')
