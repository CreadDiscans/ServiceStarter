from django.apps import AppConfig
import requests
import multiprocessing
import psutil

class ApiConfig(AppConfig):
    name = 'api'
    def ready(self):
        try:
            from api.models import MonitorServer, MonitorCpu, MonitorMemory
            address = requests.get('https://api.ipify.org').text
            servers = MonitorServer.objects.filter(address=address)
            if servers.count() == 0:
                server = MonitorServer(address=address)
                server.save()

                MonitorMemory(total=psutil.virtual_memory().total, server=server).save()
                for i in range(multiprocessing.cpu_count()):
                    MonitorCpu(name='core'+str(i), server=server).save()
            else:
                server = servers[0]
                server.monitormemory.total = psutil.virtual_memory().total
                server.monitormemory.save()
        except:
            pass