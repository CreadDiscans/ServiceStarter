from __future__ import absolute_import, unicode_literals

from celery import shared_task
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from api.models import TaskWork, MonitorServer, MonitorCpu, MonitorUsage
from datetime import datetime, timedelta
import time
import json
import psutil
import requests

@shared_task
def monitering():
    address = requests.get('https://api.ipify.org').text
    server = MonitorServer.objects.get(address=address)
    cpu_usages = psutil.cpu_percent(percpu=True)
    for i, cpu in enumerate(server.monitorcpu_set.all()):
        MonitorUsage(cpu=cpu, percent=cpu_usages[i]).save()
    MonitorUsage(memory=server.monitormemory, percent=psutil.virtual_memory().percent).save()
    MonitorUsage.objects.filter(dt__lte=datetime.now() - timedelta(days=server.keep_day)).delete()

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