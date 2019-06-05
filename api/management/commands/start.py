from django.core.management.base import BaseCommand, CommandError
import os
import subprocess

class Command(BaseCommand):

  def add_arguments(self, parser):
      pass

  def handle(self, *args, **options):
      os.system('cd react && npm install')
      subprocess.Popen(['python3', 'manage.py', 'runserver', '0.0.0.0:8000'])
      os.system('cd react && npm start')
