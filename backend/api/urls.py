from rest_framework import routers
from api import views
import importlib
import re

router = routers.DefaultRouter()
mod = importlib.import_module('api.models')

for klassName in dir(mod):
  if '__' in klassName: continue
  if klassName == 'models': continue
  klass = getattr(mod,klassName)
  parts = re.findall('[A-Z][^A-Z]*',klassName)
  router.register(r'%s'%'/'.join(parts).lower(), views.getViewSet(klass))
urlpatterns = router.urls
