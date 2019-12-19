from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from datetime import timedelta
from django.conf import settings
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.production.settings')

app = Celery('config')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    # 'add-every-30-minute-contrab': {
    #     'task': 'api.tasks.debug',
    #     # 'schedule': crontab(minute='*/1'),  # 30분마다
    #     'schedule': 5.0,  # 5초마다
    #     # 'args': (16, 16), # optional
    # }
}