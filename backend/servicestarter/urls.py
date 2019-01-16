from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

if settings.DEBUG:
    urlpatterns = static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    urlpatterns = []   
    
urlpatterns += [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', include('home.urls'))
] 
