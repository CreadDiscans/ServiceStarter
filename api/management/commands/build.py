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
      os.system('npm install -g forever')
    os.system('cd react && npm run build')
    os.system('cd react && npm run build:server')
    os.system('python3 manage.py migrate --settings=servicestarter.production_settings')
    os.system('python3 manage.py collectstatic --no-input --settings=servicestarter.production_settings')
    os.system('forever start react/server')
    if options['test']:
      os.system('python3 manage.py runsslserver --settings=servicestarter.production_settings')
    else:
      os.system('service uwsgi start')
      os.system('service nginx start')
      os.system('tail -f /dev/null')
    print('build success, time : ', time.time() - start)
