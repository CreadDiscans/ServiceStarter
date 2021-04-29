from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
import os

class Command(BaseCommand):

  def add_arguments(self, parser):
    pass

  def handle(self, *args, **options):
    self.copyModels()

  def copyModels(self):
    body = 'from django.db import models\n\n'
    type_body = "import * as custom from './custom.types'\n\n"
      
    for root, _, files in os.walk('models'):
      for file in files:
        fullpath = os.path.join(root, file)
        with open(fullpath, 'r', encoding='utf-8') as f:
          content = f.read()
        if '.py' in file:
          content = '\n'.join(content.split('\n')[4:])
          body += content
        elif '.d.ts' in file:
          type_body += content + '\n'
    # with open(os.path.join(settings.REACT_API_TYPE_PATH, 'api.types.d.ts'), 'w', encoding='utf-8') as f:
    #   f.write(type_body)
    with open('api/models.py', 'w', encoding='utf-8') as f:
      f.write(body)
