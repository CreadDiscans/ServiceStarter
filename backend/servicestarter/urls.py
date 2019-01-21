from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_swagger.views import get_swagger_view


if settings.DEBUG:
    urlpatterns = static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += [path('swagger/', get_swagger_view(title='Pastebin API'))]
else:
    urlpatterns = []   
   
urlpatterns += [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', include('home.urls'))
] 
