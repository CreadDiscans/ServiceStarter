from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, authentication_classes, api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import serializers
from config.utils import CustomSchema
from django.db.models import Q
from functools import reduce
import coreapi
import re

ITEM_COUNT_PER_PAGE = 20
SCHEMA_FILED_EXCEPT = ['page', 'id', 'count_per_page', 'depth', 'logic', 'order_by', 'ignore[]']
CHAIN_FILTER = [
  'startswith', 'endwith', 
  'lte', 'gte', 'gt', 'lt', 
  'contains', 'icontains', 
  'exact', 'iexact']

def getSerializer(modelClass):
  class ApiSerializer(serializers.ModelSerializer):
    class Meta:
        model = modelClass
        fields = '__all__'
  return ApiSerializer

def applyPagination(queryset, serializer_class,  page, count, depth, ignore):
  count_val = int(count) if count else ITEM_COUNT_PER_PAGE
  paginator = Paginator(queryset, count_val)
  try:
    items = paginator.page(page)
  except PageNotAnInteger:
    items = paginator.page(1)
  except EmptyPage:
    items = paginator.page(paginator.num_pages)
  output = []
  if depth:
    for item in items:
      output.append(applyDepth(item, int(depth), ignore))
  else:
    output = serializer_class(items, many=True).data
  res = {
    'total_page': paginator.num_pages,
    'items': output
  }
  return res

def applyOption(request, queryset):
  logic = request.GET.get('logic')
  where = []
  if logic:
    keys = logic.split('__OR__')
    for key in keys:
      value = request.GET.get(key)
      where.append(Q(**{key:value}))
  params = {}
  for key in request.GET:
    if key in SCHEMA_FILED_EXCEPT:
      continue
    if '[]' in key:
      request.GET.getlist(key)
      params[key.replace('[]', '')] = request.GET.getlist(key)
    else:
      params[key] = request.GET.get(key)
  if len(where) == 0:
    return queryset.filter(**params)
  else:
    return queryset.filter(reduce(lambda x, y: x|y, where), **params)

def addAllFieldToSchema(model, schema):
  for field in model._meta.fields:
    name = field.__str__().split('.')[-1]
    if name in SCHEMA_FILED_EXCEPT:
      continue
    schema.append(coreapi.Field(name, location='query'))
  return schema

def applyDepth(item, depth, ignore):
  if item is None:
    return None
  if depth == -1:
    return item.id
  data = getSerializer(item.__class__)(item).data
  for field in item.__class__._meta.get_fields():
    if field.name in ignore:
      continue
    if field.many_to_one or field.one_to_one:
      try:
        data[field.name] = applyDepth(getattr(item, field.name), depth-1, ignore)
      except ObjectDoesNotExist:
        data[field.name] = None
    elif field.many_to_many:
      if not hasattr(item, field.name):
        continue
      data[field.name] = []
      for m2m_item in getattr(item, field.name).all():
        data[field.name].append(applyDepth(m2m_item, depth-1, ignore))
  return data

def getViewSet(modelClass):
  @permission_classes((IsAuthenticatedOrReadOnly,))
  @authentication_classes((JSONWebTokenAuthentication, SessionAuthentication))
  class ApiViewSet(viewsets.ModelViewSet):
    queryset = modelClass.objects.all().order_by('-id')
    serializer_class = getSerializer(modelClass)

    schema = CustomSchema({
      'list': addAllFieldToSchema(modelClass, [
        coreapi.Field('page', required=False, location='query', type='int',description='It is for pagination. If not set, no pagination'),
        coreapi.Field('count_per_page', required=False, location='query', type='int', description='item count per page. defuault is 20'),
        coreapi.Field('depth', required=False, location='query', type='int', description='query with models connected by foreignKey'),
        coreapi.Field('logic', required=False, location='query', type='string', description='split keys with __OR__ ')
      ]),
      'retrieve': [
        coreapi.Field('depth', required=False, location='query', type='int', description='query with models connected by foreignKey')
      ]
    })

    def list(self, request):
      page = request.GET.get('page')
      depth = request.GET.get('depth')
      count = request.GET.get('count_per_page')
      order = request.GET.get('order_by')
      ignore = request.GET.get('ignore[]')
      if ignore:
        ignore = request.GET.getlist(ignore)
      else:
        ignore = []
      queryset = applyOption(request, self.queryset)
      if order:
        queryset = queryset.order_by(order)
      if page:
        res = applyPagination(queryset, self.serializer_class, page, count, depth, ignore)
      else:
        res = []
        if depth:
          for item in queryset.all():
            res.append(applyDepth(item, int(depth), ignore))
        else:
          res = self.serializer_class(queryset, many=True).data

      return Response(res, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
      try:
        item = self.queryset.get(pk=pk)
      except:
        return Response(status=status.HTTP_404_NOT_FOUND)
      depth = request.GET.get('depth')
      if depth:
        return Response(data=applyDepth(item, int(depth), []), status=status.HTTP_200_OK)
      else:
        return Response(data=self.serializer_class(item).data, status=status.HTTP_200_OK)

  return ApiViewSet
