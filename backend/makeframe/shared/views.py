from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

@permission_classes((IsAuthenticatedOrReadOnly,))
@authentication_classes((JSONWebTokenAuthentication,))
class SharedViewSet(viewsets.ModelViewSet):
  queryset = None
  serializer_class = None

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