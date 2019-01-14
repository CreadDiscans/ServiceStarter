import os


class Maker:
  URLS_PY = '''from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
urlpatterns = router.urls'''
  SERIALIZERS_PY = '''from rest_framework import serializers
from .models import *
'''

  def make(self, app):
    for appName in app:
      self.makeApp(appName)
      self.makeModel(app[appName])

  def makeApp(self, appName):
    name = appName.split('.')[-1]
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
    
  def makeModel(self, models):
    for klass in models:
      instance = klass()
      print(dir(instance))