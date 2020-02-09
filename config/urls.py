from django.contrib import admin
from django.contrib.auth.models import update_last_login
from django.urls import path, include, re_path
from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_swagger.views import get_swagger_view
from rest_framework import routers
from rest_framework_jwt.views import ObtainJSONWebToken, obtain_jwt_token, refresh_jwt_token, verify_jwt_token
from .views import index, UserViewSet, GroupViewSet, fcm_test, assets, activate, send_reset_mail, UploadViewset, PaymentValidator, IamportWebhook
  
router = routers.DefaultRouter()
router.register(r'api-user', UserViewSet)
router.register(r'api-group', GroupViewSet)
router.register(r'upload', UploadViewset, basename='uploader')
router.register(r'payment', PaymentValidator, basename='payment')
router.register(r'webhook', IamportWebhook, basename='webhook')

class ObtainAuthTokenWithLogin(ObtainJSONWebToken):
    def post(self, request):
        result = super().post(request)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.object.get('user')
            update_last_login(None, user)
        return result

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token-auth/', ObtainAuthTokenWithLogin.as_view()),
    path('api/token-refresh/', refresh_jwt_token),
    path('api/token-verify/', verify_jwt_token),
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
    ]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns +=[url('', index)]