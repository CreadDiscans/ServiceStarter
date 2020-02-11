from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from api.consumers import MessageConsumer, TaskConsumer
from django.conf.urls import url

websocket_urlpatterns = [
    url(r'^ws/message/(?P<room_name>)[^/]+/$', MessageConsumer),
    url(r'^ws/task/(?P<task_id>[^/]+)/$', TaskConsumer)
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    )
})