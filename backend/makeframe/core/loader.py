from makeframe import models
from django.conf import settings
import importlib
import os
import sys

class Loader:

  def __init__(self):
    self.data = []
    self.load()

  def load(self):
    path = models.__file__.split('__')[0]
    for file in os.listdir(path):
      if '__' in file: continue
      mod = importlib.import_module('makeframe.models.'+file.split('.')[0])
      self.loadFile(mod)

  def loadFile(self, mod):
    item = {}
    item[mod.__name__] = []
    for klassName in dir(mod):
      if '__' in klassName: continue
      if klassName == 'fields': continue
      klass = getattr(mod,klassName)
      item[mod.__name__].append(klass)
    self.data.append(item)

  def readFile(self, app):
    target = []
    for key in app:
      with open(os.path.join(settings.BASE_DIR,key.replace('.','/')+'.py'), 'r') as f:
        content = f.read()
      for line in content.split('\n'):
        if 'class' in line and not 'class Admin:' in line:
          target.append(line.replace('class ', '').replace(':', ''))
      tmp = app[key]
      app[key] = []
      for t in target:
        for item in tmp:
          if t == item.__name__:
            app[key].append(item)

  def getModels(self):
    for app in self.data:
      self.readFile(app)
    return self.data