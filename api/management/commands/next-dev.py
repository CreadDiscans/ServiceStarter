from django.core.management.base import BaseCommand, CommandError
import os
import subprocess

class Command(BaseCommand):

  def add_arguments(self, parser):
      pass

  def handle(self, *args, **options):
      subprocess.Popen(['redis-server'])
      subprocess.Popen(['celery', '-A', 'config.dev', 'worker', '--loglevel=info'])
      subprocess.Popen(['celery', '-A', 'config.dev', 'beat', '--loglevel=info', '--scheduler', 'django_celery_beat.schedulers:DatabaseScheduler'])
      subprocess.Popen(['python', 'manage.py', 'runserver', '0.0.0.0:8000'])
      os.system('cd nextjs && npm run dev')
