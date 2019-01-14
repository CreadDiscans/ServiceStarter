import os


class Maker:
  URLS_PY = '''from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
urlpatterns = router.urls'''
  SERIALIZERS_PY = '''from rest_framework import serializers
from .models import *
'''
  MODEL_ITEM = '''\nclass %s(models.Model):\n'''
  SERIALIZER_ITEM = '''\nclass %sSerializer(serializers.ModelSerializer):
  class Meta:
    model = %s
    fields = '__all__'\n'''

  def make(self, app):
    for appName in app:
      name = appName.split('.')[-1]
      self.makeApp(name)
      self.makeModels(app[appName], name)

  def makeApp(self, name):
    if not os.path.exists(name):
      os.system('python manage.py startapp %s'%name)
    if not os.path.exists(os.path.join(name, 'urls.py')):
      with open(os.path.join(name, 'urls.py'), 'w') as f:
        f.write(self.URLS_PY)
    if not os.path.exists(os.path.join(name, 'serializers.py')):
      with open(os.path.join(name, 'serializers.py'), 'w') as f:
        f.write(self.SERIALIZERS_PY)
    self.setInstalledApp(name)
    self.setRootUrls(name)
      
  def setInstalledApp(self, name):
    fullpath = os.path.join(self.getRootPackage(name), 'settings.py')
    with open(fullpath, 'r') as f:
      settings = f.read()
    isFound = False
    newSettings = ''
    for line in settings.split('\n'):
      if isFound:
        if name in line:
          return
        if ']' in line:
          line = '    \'%s\',\n]'%name
          isFound = False
      else:
        if 'INSTALLED_APPS' in line: 
          isFound = True
      newSettings += line +'\n'
    newSettings = newSettings[:-1]
    with open(fullpath, 'w') as f:
      f.write(newSettings)

  def setRootUrls(self, name):
    fullpath = os.path.join(self.getRootPackage(name), 'urls.py')
    with open(fullpath, 'r') as f:
      urls = f.read()
    newUrls = ''
    for line in urls.split('\n'):
      if name+'/' in  line: 
        return
      if "path('', include('home.urls'))" in line:
        line = "    path('api/%s/', include('%s.urls')),\n    path('', include('home.urls'))"%(name, name)
      newUrls += line + '\n'
    newUrls = newUrls[:-1]
    with open(fullpath, 'w') as f:
      f.write(newUrls)

  def getRootPackage(self, name):
    for root, _, files in os.walk('.'):
      if 'lib' in root: 
        continue
      if '__' in root: 
        continue
      for file in files:
        if 'settings' in file:
          return root
    
  def makeModels(self, models, name):
    for klass in models:
      instance = klass()
      self.makeModelPy(instance, name)
      self.makeSerializerPy(instance, name)
  
  def makeModelPy(self, instance, name):
    body = self.MODEL_ITEM%instance.__class__.__name__
    with open(os.path.join(name, 'models.py'), 'r') as f:
      models = f.read()
    if body in models:
      return
    work = []
    for field in dir(instance):
      if '__' in field: 
        continue
      ff = getattr(instance, field)
      if ff.need() is not None:
        work.append(ff.need())
      body += ff.toString()%field
    for w in work:
      if w['type'] == 'import':
        if w['content'] in models:
          continue
        body = w['content'] + '\n' + body  
    with open(os.path.join(name, 'models.py'), 'a') as f:
      f.write(body)
  
  def makeSerializerPy(self, instance, name):
    body = self.SERIALIZER_ITEM%(instance.__class__.__name__, instance.__class__.__name__)
    with open(os.path.join(name, 'serializers.py'), 'r') as f:
      serialisers = f.read()
    if body in serialisers:
      return
    # work = []
    # for field in dir(instance):
    #   if '__' in field: 
    #     continue
    #   ff = getattr(instance, field)
    #   if ff.need() is not None:
    #     work.append(ff.need())
    #   body += ff.toString()%field
    # for w in work:
    #   if w['type'] == 'import':
    #     if w['content'] in models:
    #       continue
    #     body = w['content'] + '\n' + body  
    with open(os.path.join(name, 'serializers.py'), 'a') as f:
      f.write(body)
  
  