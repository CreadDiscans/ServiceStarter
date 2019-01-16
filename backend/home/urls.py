from django.urls import path, include
from django.conf.urls import url
from django.conf import settings
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token
from home import views

router = routers.DefaultRouter()
router.register(r'api/home/user', views.UserViewSet)
router.register(r'api/home/group', views.GroupViewSet)
urlpatterns = [
    path('api/token-auth/', obtain_jwt_token),
    path('api/token-refresh/', refresh_jwt_token),
    path('api/token-verify/', verify_jwt_token),
]
if not settings.DEBUG:
    urlpatterns += [path('', views.index)]
urlpatterns += router.urls

if not settings.DEBUG:
    urlpatterns += [url('^', views.index)]
