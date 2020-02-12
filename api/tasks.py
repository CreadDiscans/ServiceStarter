from __future__ import absolute_import, unicode_literals

from celery import shared_task
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from api.models import TaskWork
from datetime import datetime
import time
import json
# @shared_task
# def debug():
#     now = datetime.now()
#     print(now, settings.SETTING_MODE)

def update_task(task, progress):
    if TaskWork.objects.filter(pk=task.id).count() > 0:
        task.status = 'success' if progress == 100 else 'running'
        task.progress = progress
        task.save()
        clients = task.taskclient_set.all()
        channel_layer = get_channel_layer()
        for client in clients:
            async_to_sync(channel_layer.send)(client.channel_name, {
                'type': 'from.celery'
            })
        return True
    return False

def one_minute_task(task):
    for i in range(100):
        time.sleep(1)
        if not update_task(task, i):
            return
    update_task(task, 100)

@shared_task
def background_task(task_id):
    task = TaskWork.objects.get(pk=task_id)
    if task.body is not None:
        body = json.loads(task.body)
        if body['task'] == 'one_minute_task':
            one_minute_task(task) 