from django.core.management.base import BaseCommand, CommandError
import os

class Command(BaseCommand):

  def add_arguments(self, parser):
    pass

  def handle(self, *args, **options):
    os.system('cd react && npm install')
    os.system('cd react && npm run build')
    os.system('python manage.py migrate --settings=servicestarter.production_settings')
    os.system('python manage.py collectstatic --no-input --settings=servicestarter.production_settings')