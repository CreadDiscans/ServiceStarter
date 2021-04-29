from django.contrib import admin
from django.contrib.auth.models import update_last_login, User
from django.urls import path, include, re_path
from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_swagger.views import get_swagger_view
from rest_framework import routers
from rest_framework_jwt.views import ObtainJSONWebToken, refresh_jwt_token
from config.auth import ObtainAuthToken, RefreshAuthToken, SocialSiginViewSet
from .views import *
router = routers.DefaultRouter()
router.register(r'api-user', UserViewSet)
router.register(r'api-group', GroupViewSet)
router.register(r'social', SocialSiginViewSet, basename='social')
router.register(r'upload', UploadViewset, basename='uploader')
router.register(r'payment', PaymentValidator, basename='payment')
router.register(r'webhook', IamportWebhook, basename='webhook')
router.register(r'billings', Billings, basename='billings')
router.register(r'sendfcm', FcmSender, basename='fcm')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token-auth/', ObtainAuthToken.as_view()),
    path('api/token-refresh/', RefreshAuthToken.as_view()),
    path('api-', include('api.urls')),
    path('activate/<str:uid64>/<str:token>/', activate),
    path('send_reset_mail', send_reset_mail),
    path('fcm_test', fcm_test),
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    path('', index)
]
urlpatterns += router.urls

if settings.DEBUG:
    urlpatterns += [
        path('swagger/', get_swagger_view(title='Pastebin API')),
        path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
        url(r'assets/', assets),
        path('firebase-messaging-sw.js', assets),
    ]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns +=[url('', index)]