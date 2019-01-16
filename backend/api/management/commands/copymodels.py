from django.core.management.base import BaseCommand, CommandError
import os

class Command(BaseCommand):

  def add_arguments(self, parser):
    pass

  def handle(self, *args, **options):
    body = 'from django.db import models\n\n'

    for file in os.listdir('models'):
      with open('models/'+file, 'r') as f:
        content = f.read()
      content = '\n'.join(content.split('\n')[4:])
      body += content
    with open('api/models.py', 'w') as f:
      f.write(body)