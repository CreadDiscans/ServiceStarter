from __future__ import absolute_import, unicode_literals
from celery import shared_task
from datetime import datetime
from django.conf import settings
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

@shared_task
def debug():
    now = datetime.now()
    logger.info('['+str(now) + ']' + settings.SETTING_MODE)
