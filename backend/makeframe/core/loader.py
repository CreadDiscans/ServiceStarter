from makeframe import models
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

  def getModels(self):
    return self.data