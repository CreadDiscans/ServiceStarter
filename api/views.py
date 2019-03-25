from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, authentication_classes, api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import serializers
from servicestarter.utils import CustomSchema
import importlib
import coreapi
import re

ITEM_COUNT_PER_PAGE = 20
def getSerializer(modelClass):
  class ApiSerializer(serializers.ModelSerializer):
    class Meta:
        model = modelClass
        fields = '__all__'
  return ApiSerializer

def getViewSet(modelClass):
  @permission_classes((IsAuthenticatedOrReadOnly,))
  @authentication_classes((JSONWebTokenAuthentication, SessionAuthentication))
  class ApiViewSet(viewsets.ModelViewSet):
    queryset = modelClass.objects.all().order_by('-id')
    serializer_class = getSerializer(modelClass)

    schema = CustomSchema({
      'list': [
        coreapi.Field('page', required=False, location='query', type='int',description='It is for pagination. If not set, no pagination')
      ]
    })

    def list(self, request):
      page = request.GET.get('page')

      serializers = self.serializer_class(self.queryset, many=True)

      paginator = Paginator(self.queryset, ITEM_COUNT_PER_PAGE)
      if page:
        try:
          items = paginator.page(page)
        except PageNotAnInteger:
          items = paginator.page(1)
        except EmptyPage:
          items = paginator.page(paginator.num_pages)
        serializers = self.serializer_class(items, many=True)
        res = {
          'total_page': paginator.num_pages,
          'items': serializers.data
        }
        res['total_page']
      else:
        res = serializers.data

      return Response(res, status=status.HTTP_200_OK)

  return ApiViewSet
