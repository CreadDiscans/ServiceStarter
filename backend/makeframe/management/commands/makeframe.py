from django.core.management.base import BaseCommand, CommandError
from makeframe.core.loader import Loader
from makeframe.core.maker import Maker

class Command(BaseCommand):

  def add_arguments(self, parser):
    pass

  def handle(self, *args, **options):
    loader = Loader()
    models = loader.getModels()
    maker = Maker()
    for app in models:
      maker.make(app)