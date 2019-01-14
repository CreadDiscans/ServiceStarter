import os


class Maker:
  URLS_PY = '''from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
urlpatterns = router.urls'''
  URLS_ITEM = '''router.register(r'%s', %sViewSet)\n'''
  URLS_ROOT_ITEM = '''    path('api/%s/', include('%s.urls')),\n'''
  SERIALIZERS_PY = '''from rest_framework import serializers
from .models import *
'''
  MODEL_ITEM = '''\nclass %s(models.Model):\n'''
  SERIALIZER_ITEM = '''\nclass %sSerializer(serializers.ModelSerializer):
  class Meta:
    model = %s
    fields = '__all__'\n'''
  VIEWS_PY = '''from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.conf import settings
from %s.models import *
from %s.serializers import *
  '''
  VIEWS_ITEM = '''\n@permission_classes((IsAuthenticatedOrReadOnly,))
@authentication_classes((JSONWebTokenAuthentication,))
class %sViewSet(viewsets.ModelViewSet):
  queryset = %s.objects.all().order_by('-id')
  serializer_class = %sSerializer

  def list(self, request):
    page = request.GET.get('page')
    paginator = Paginator(queryset, settings.ITEM_COUNT_PER_PAGE)
    try:
        items = paginator.page(page)
    except PageNotAnInteger:
        items = paginator.page(1)
    except EmptyPage:
        items = paginator.page(paginator.num_pages)

    serializers = self.serializer_class(items, many=True)
    res = {}
    res['totalPages'] = paginator.num_pages
    res['items'] = serializers.data
    return Response(res, status=status.HTTP_200_OK)\n'''
  ADMIN_PY = '''from django.contrib import admin
from %s.models import *\n'''
  ADMIN_ITEM = '''admin.site.register(%s)\n'''

  REACT_ROUTE = '''        {group: '%s', name:'%s', link:'/data-test/%s/%s'},\n'''
  REACT_ROUTE2 = '''                        <Route path="/data-test/%s/%s" component={A.%s} />\n'''
  REACT_INDEX = '''export const %s = asyncRoute(() => import('./data/%s/%s'));\n'''

  def make(self, app):
    for appName in app:
      name = appName.split('.')[-1]
      self.makeApp(name)
      self.makeModels(app[appName], name)
      self.makeReact(app[appName], name)

  def makeApp(self, name):
    if not os.path.exists(name):
      os.system('python manage.py startapp %s'%name)
    self.setUrlsPy(name)
    self.setSerializersPy(name)
    self.setViewsPy(name)
    self.setAdminPy(name)
    self.setInstalledApp(name)
    self.setRootUrls(name)

  def setUrlsPy(self, name):
    if not os.path.exists(os.path.join(name, 'urls.py')):
      with open(os.path.join(name, 'urls.py'), 'w') as f:
        f.write(self.URLS_PY)

  def setSerializersPy(self, name):
    if not os.path.exists(os.path.join(name, 'serializers.py')):
      with open(os.path.join(name, 'serializers.py'), 'w') as f:
        f.write(self.SERIALIZERS_PY)

  def setViewsPy(self, name):
    with open(os.path.join(name, 'views.py'), 'r') as f:
      views = f.read()
    if not 'rest_framework' in views:
      with open(os.path.join(name, 'views.py'), 'w') as f:
        f.write(self.VIEWS_PY%(name, name))

  def setAdminPy(self, name):
    if self.check(name, 'admin.py', self.ADMIN_PY%name):
      with open(os.path.join(name, 'admin.py'), 'w') as f:
        f.write(self.ADMIN_PY%name)

  def setInstalledApp(self, name):
    fullpath = os.path.join(self.getRootPackage(name), 'settings.py')
    if self.check(self.getRootPackage(name), 'settings.py', '    \'%s\',\n'%name):
      self.insertLine(fullpath, '    \'%s\',\n'%name, '# new app inserted here automatically')

  def setRootUrls(self, name):
    if self.check(self.getRootPackage(name), 'urls.py', name+'/'):
      self.insertLine(os.path.join(self.getRootPackage(name), 'urls.py'), self.URLS_ROOT_ITEM%(name, name), "# app urls are inserted here automatinally")

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
      self.makeViewPy(instance, name)
      self.makeUrlsPy(instance, name)
      self.makeAdminPy(instance, name)
  
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
    if self.check(name, 'serializers.py', body):
      with open(os.path.join(name, 'serializers.py'), 'a') as f:
        f.write(body)
  
  def makeViewPy(self, instance, name):
    n = instance.__class__.__name__
    body = self.VIEWS_ITEM%(n,n,n)
    header = body.split('\n')[3]
    if self.check(name, 'views.py', header):
      with open(os.path.join(name, 'views.py'), 'a') as f:
        f.write(body)

  def makeUrlsPy(self, instance, name):
    n = instance.__class__.__name__
    body = self.URLS_ITEM%(n.lower().replace(name, ''),n)
    if self.check(name, 'urls.py', body):
      self.insertLine(os.path.join(name, 'urls.py'), body, 'urlpatterns = router.urls')

  def makeAdminPy(self, instance, name):
    body = self.ADMIN_ITEM%(instance.__class__.__name__)
    if self.check(name, 'admin.py', instance.__class__.__name__):
      with open(os.path.join(name, 'admin.py'), 'a') as f:
        f.write(body)

  def makeReact(self, models, name):
    base = '../frontend/src/app/data'
    directory = os.path.join(base, name)
    if not os.path.exists(directory):
      os.mkdir(directory)
    for klass in models:
      instance = klass()
      self.routeDataTest(instance, base, name)
      self.makeReactDataTest(instance, directory)

  def routeDataTest(self, instance, directory, appName):
    name = 'DataTest'+instance.__class__.__name__
    lowername = instance.__class__.__name__.lower().replace(appName, '')
    body = self.REACT_ROUTE%(appName, lowername, appName, lowername)
    fullname = os.path.join(directory, 'DataTest.js')
    if self.check(directory, 'DataTest.js', body):
      self.insertLine(fullname, body, '// data test inserted automatically')
    body = self.REACT_ROUTE2%(appName, lowername, name)
    if self.check(directory, 'DataTest.js', body):
      self.insertLine(fullname, body, '{/* data test inserted automatically */}')
    body = self.REACT_INDEX%(name, appName, name)
    if self.check(directory, 'index.js', body):
      self.insertLine(os.path.join(directory, 'index.js'), body, '// data test inserted automatically')

  def makeReactDataTest(self, instance, directory):
    name = 'DataTest'+instance.__class__.__name__
    filename = os.path.join(directory, name+'.js')
    if not os.path.exists(filename):
      with open(filename, 'w') as f:
        f.write('hello')

  def check(self, name, file, body):
    with open(os.path.join(name, file), 'r') as f:
      content = f.read()
    if body in content:
      return False
    else:
      return True

  def insertLine(self, fullname, body, before):
    with open(fullname, 'r') as f:
      content = f.read()
    newContent = ''
    for line in content.split('\n'):
      if before in line:
        newContent += body
      newContent += line+'\n'
    newContent = newContent[:-1]
    with open(fullname, 'w') as f:
      f.write(newContent)