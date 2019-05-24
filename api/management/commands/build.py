from django.core.management.base import BaseCommand, CommandError
import os
import time

class Command(BaseCommand):

  def add_arguments(self, parser):
    parser.add_argument('--skip-install',
      action="store_true",
      dest='skip_install',
      default=False,
      help='Skip npm, pip install')
    
    parser.add_argument('--run',
      action='store_true',
      dest='test',
      default=False,
      help='runserver with production settings')

  def handle(self, *args, **options):
    start = time.time()
    if not options['skip_install']:
      os.system('cd react && npm install')
      os.system('pip install -U -r requirements.txt')
    os.system('cd react && npm run build')
    os.system('cd react && npm run build:server')
    os.system('python manage.py migrate --settings=servicestarter.production_settings')
    os.system('python manage.py collectstatic --no-input --settings=servicestarter.production_settings')
    os.system('forever start react/server')
    if options['test']:
      os.system('python manage.py runsslserver --settings=servicestarter.production_settings')
    print('build success, time : ', time.time() - start)
