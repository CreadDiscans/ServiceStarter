from django.apps import AppConfig

class ApiConfig(AppConfig):
    name = 'api'
    def ready(self):
        from api.models import MonitorServer, MonitorCpu, MonitorMemory
        from uuid import getnode as get_mac
        import multiprocessing
        import psutil
        mac = get_mac()
        mac_address = ':'.join(("%012X" % mac)[i:i+2] for i in range(0, 12, 2))
        servers = MonitorServer.objects.filter(mac_address=mac_address)
        if servers.count() == 0:
            server = MonitorServer(mac_address=mac_address)
            server.save()

            MonitorMemory(total=psutil.virtual_memory().total, server=server).save()
            for i in range(multiprocessing.cpu_count()):
                MonitorCpu(name='core'+str(i), server=server).save()
        else:
            server = servers[0]
            server.monitormemory.total = psutil.virtual_memory().total
            server.monitormemory.save()