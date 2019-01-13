from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from board import models, serializers

ITEM_COUNT_PER_PAGE = 10

@permission_classes((IsAuthenticatedOrReadOnly,))
@authentication_classes((JSONWebTokenAuthentication,))
class BoardGroupViewSet(viewsets.ModelViewSet):
  queryset = models.BoardGroup.objects.all().order_by('-id')
  serializer_class = serializers.BoardGroupSerializer

@permission_classes((IsAuthenticatedOrReadOnly,))
@authentication_classes((JSONWebTokenAuthentication,))
class BoardItemViewSet(viewsets.ModelViewSet):
  queryset = models.BoardItem.objects.all().order_by('-id')
  serializer_class = serializers.BoardItemSerializer

  def list(self, request):
    page = request.GET.get('page')
    group_id = request.GET.get('group_id')
    if group_id: 
      queryset = self.queryset.filter(group=group_id)
    else:
      queryset = self.queryset
    paginator = Paginator(queryset, ITEM_COUNT_PER_PAGE)
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

@permission_classes((IsAuthenticatedOrReadOnly,))
@authentication_classes((JSONWebTokenAuthentication,))
class BoardCommentViewSet(viewsets.ModelViewSet):
  queryset = models.BoardComment.objects.all().order_by('-id')
  serializer_class = serializers.BoardCommentSerializer

  def list(self, request):
    item_id = request.GET.get('item_id')
    if item_id: 
      queryset = self.queryset.filter(item__id=item_id, parent__isnull=True)
    else:
      return Respnose(status.HTTP_400_BAD_REQUEST)
    serializers = self.serializer_class(queryset, many=True)
    return Response(serializers.data, status=status.HTTP_200_OK)

