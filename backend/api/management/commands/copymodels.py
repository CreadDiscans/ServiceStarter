from django.core.management.base import BaseCommand, CommandError
import os

class Command(BaseCommand):

  def add_arguments(self, parser):
    pass

  def handle(self, *args, **options):
    self.copyModels()

  def copyModels(self):
    body = 'from django.db import models\n\n'

    for file in os.listdir('models'):
      with open('models/'+file, 'r', encoding='utf-8') as f:
        content = f.read()
      content = '\n'.join(content.split('\n')[4:])
      body += content
    with open('api/models.py', 'w', encoding='utf-8') as f:
      f.write(body)
