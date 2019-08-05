from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, authentication_classes, api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import serializers
from config.utils import CustomSchema
from django.views.decorators.cache import never_cache
import coreapi
import re

ITEM_COUNT_PER_PAGE = 20
SCHEMA_FILED_EXCEPT = ['page', 'filter', 'id', 'count_per_page', 'depth']
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

def applyPagination(queryset, serializer_class,  page, count, depth):
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
      output.append(applyDepth(item, int(depth)))
  else:
    output = serializer_class(items, many=True).data
  res = {
    'total_page': paginator.num_pages,
    'items': output
  }
  return res

def applyOption(request, queryset):
  op = request.GET.get('filter')
  params = {}
  for key in request.GET:
    if key in SCHEMA_FILED_EXCEPT:
      continue
    if op in CHAIN_FILTER:
      params[key+'__'+op] = request.GET.get(key)
    else:
      params[key] = request.GET.get(key)

  return queryset.filter(**params)

def addAllFieldToSchema(model, schema):
  for field in model._meta.fields:
    name = field.__str__().split('.')[-1]
    if name in SCHEMA_FILED_EXCEPT:
      continue
    schema.append(coreapi.Field(name, location='query'))
  return schema


def applyDepth(item, depth):
  if item is None:
    return None
  if depth == -1:
    return item.id
  data = getSerializer(item.__class__)(item).data
  for field in item.__class__._meta.get_fields():
    if field.many_to_one or field.one_to_one:
      data[field.name] = applyDepth(getattr(item, field.name), depth-1)
    elif field.many_to_many:
      if not hasattr(item, field.name):
        continue
      data[field.name] = []
      for m2m_item in getattr(item, field.name).all():
        data[field.name].append(applyDepth(m2m_item, depth-1))
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
        coreapi.Field('filter', required=False, location='query', type='string',description='support : '+', '.join(CHAIN_FILTER)),
        coreapi.Field('depth', required=False, location='query', type='int', description='query with models connected by foreignKey')
      ]),
      'retrieve': [
        coreapi.Field('depth', required=False, location='query', type='int', description='query with models connected by foreignKey')
      ]
    })

    @never_cache
    def list(self, request):
      page = request.GET.get('page')
      depth = request.GET.get('depth')
      count = request.GET.get('count_per_page')
      queryset = applyOption(request, self.queryset)
      if page:
        res = applyPagination(queryset, self.serializer_class, page, count, depth)
      else:
        res = []
        if depth:
          for item in queryset.all():
            res.append(applyDepth(item, int(depth)))
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
        return Response(data=applyDepth(item, int(depth)), status=status.HTTP_200_OK)
      else:
        return Response(data=self.serializer_class(item).data, status=status.HTTP_200_OK)
      
    def update(self, request, pk=None):
      partial = True
      instance = self.get_object()
      serializer = self.get_serializer(instance, data=request.data, partial=partial)
      serializer.is_valid(raise_exception=True)
      self.perform_update(serializer)

      if getattr(instance, '_prefetched_objects_cache', None):
          # If 'prefetch_related' has been applied to a queryset, we need to
          # forcibly invalidate the prefetch cache on the instance.
          instance._prefetched_objects_cache = {}

      return Response(serializer.data)

  return ApiViewSet
