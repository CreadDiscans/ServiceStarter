from django.core.management.base import BaseCommand, CommandError
import os
import subprocess

class Command(BaseCommand):

  def add_arguments(self, parser):
      pass

  def handle(self, *args, **options):
      os.system('service uwsgi start')
