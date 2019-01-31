from django.contrib import admin
import importlib
import os

def register():
  mod = importlib.import_module('api.models')

  for klassName in dir(mod):
    if '__' in klassName: continue
    if klassName == 'models': continue
    klass = getattr(mod,klassName)
    admin.site.register(klass)

register()