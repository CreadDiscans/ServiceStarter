from __future__ import absolute_import, unicode_literals

from celery import shared_task
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from api.models import TaskWork, MonitorServer, MonitorCpu, MonitorUsage, MonitorMemory
from datetime import datetime, timedelta
import time
import json
import psutil
import os
import multiprocessing

@shared_task
def monitering():
    machine_name = os.path.join(settings.BASE_DIR, 'name.txt')
    if not os.path.exists(machine_name):
        return
    with open(machine_name, 'r') as f:
        name = f.read()
    server = MonitorServer.objects.filter(address=name)
    if server.count() == 0:
        server = MonitorServer(address=name)
        server.save()

        MonitorMemory(total=psutil.virtual_memory().total/pow(2,20), server=server).save()
        for i in range(multiprocessing.cpu_count()):
            MonitorCpu(name='core'+str(i), server=server).save()
    else:
        server = server[0] 

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