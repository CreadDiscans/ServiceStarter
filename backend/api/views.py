from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, authentication_classes, api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import serializers
import importlib
import re

def getSerializer(modelClass):
  class ApiSerializer(serializers.ModelSerializer):
    class Meta:
        model = modelClass
        fields = '__all__'
  return ApiSerializer

def getViewSet(modelClass):
  @permission_classes((IsAuthenticatedOrReadOnly,))
  @authentication_classes((JSONWebTokenAuthentication,))
  class ApiViewSet(viewsets.ModelViewSet):
    queryset = modelClass.objects.all().order_by('-id')
    serializer_class = getSerializer(modelClass)

    def list(self, request):
      page = request.GET.get('page')
      fields = []
      kwargs = {}
      for field in request.GET:
        if field == 'page': continue
        kwargs['{0}'.format(field)] = request.GET.get(field)

      self.queryset = self.queryset.filter(**kwargs)

      paginator = Paginator(self.queryset, settings.ITEM_COUNT_PER_PAGE)
      try:
          items = paginator.page(page)
      except PageNotAnInteger:
          items = paginator.page(1)
      except EmptyPage:
          items = paginator.page(paginator.num_pages)

      serializers = self.serializer_class(items, many=True)
      res = {}
      res['totalPages'] = paginator.num_pages
      res['items'] = serializers.data
      return Response(res, status=status.HTTP_200_OK)
  return ApiViewSet

@api_view(('GET',))
@permission_classes((AllowAny,))
def spec(request):
  mod = importlib.import_module('api.models')
  data = []
  for klassName in dir(mod):
    if '__' in klassName: continue
    if klassName == 'models': continue
    klass = getattr(mod,klassName)
    parts = re.findall('[A-Z][^A-Z]*',klassName)
    instance = klass()
    fields = []
    for ff in list(klass.__dict__):
      if any(x in ff for x in ['__', 'objects', 'DoesNotExist', 'MultipleObjectsReturned', '_set', '_id', '_meta', 'get_next_by_', 'get_previous_by_']): 
        continue
      fields.append(ff)
    item = {
      'url': '/'.join(parts).lower(),
      'name': klassName,
      'fields': fields
    }
    data.append(item)

  return Response(data)