from django.shortcuts import HttpResponse
from django.contrib.auth.models import User, Group
from django.conf import settings
from rest_framework import viewsets
from home.serializers import UserSerializer, GroupSerializer
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
import requests

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
    r = requests.get(settings.REACT_URL + request.path)
    return HttpResponse(r.text)
