from django.urls import path
from rest_framework import routers
from board import views

router = routers.DefaultRouter()
router.register(r'group', views.BoardGroupViewSet)
router.register(r'item', views.BoardItemViewSet)
router.register(r'comment', views.BoardCommentViewSet)
urlpatterns = router.urls
