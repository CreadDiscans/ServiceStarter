from __future__ import absolute_import, unicode_literals

from celery import shared_task
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from api.models import TaskWork
from datetime import datetime
import time
# @shared_task
# def debug():
#     now = datetime.now()
#     print(now, settings.SETTING_MODE)

def update_task(task):
    clients = task.taskclient_set.all()
    channel_layer = get_channel_layer()
    for client in clients:
        async_to_sync(channel_layer.send)(client.channel_name, {
            'type': 'from.celery'
        })

@shared_task
def one_minute_task(task_id):
    print(task_id)
    task = TaskWork.objects.get(pk=task_id)
    for i in range(100):
        time.sleep(1)
        task.progress = i
        task.status = 'info'
        task.save()
        update_task(task)
    task.status = 'success'
    task.progress = 100
    task.save()
    update_task(task)
    return True