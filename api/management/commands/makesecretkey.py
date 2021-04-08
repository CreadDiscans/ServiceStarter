from django.core.management.utils import get_random_secret_key  

from django.core.management.base import BaseCommand

class Command(BaseCommand):

  def add_arguments(self, parser):
      pass

  def handle(self, *args, **options):
      print(get_random_secret_key())