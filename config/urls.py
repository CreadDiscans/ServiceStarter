from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from django.conf import settings
from rest_framework_swagger.views import get_swagger_view
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token
from .views import index, UserViewSet, GroupViewSet
  
router = routers.DefaultRouter()
router.register(r'api-user', UserViewSet)
router.register(r'api-group', GroupViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token-auth/', obtain_jwt_token),
    path('api/token-refresh/', refresh_jwt_token),
    path('api/token-verify/', verify_jwt_token),
    path('api-', include('api.urls')),
    path('', index)
]
urlpatterns += router.urls

if settings.DEBUG:
    urlpatterns += [
        path('swagger/', get_swagger_view(title='Pastebin API')),
        path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    ]

urlpatterns +=[url('', index)]