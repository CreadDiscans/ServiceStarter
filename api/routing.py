from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from api.consumers import MessageConsumer
from django.conf.urls import url

websocket_urlpatterns = [
    url(r'^ws/message/(?P<room_name>)[^/]+/$', MessageConsumer)
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    )
})