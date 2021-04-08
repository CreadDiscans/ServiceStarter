from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from api.consumers import MessageConsumer, TaskConsumer, HMRHttpConsumer
from django.conf.urls import url
from django.core.asgi import get_asgi_application

websocket_urlpatterns = [
    url(r'^ws/message/(?P<room_name>)[^/]+/$', MessageConsumer.as_asgi()),
    url(r'^ws/task/(?P<task_id>[^/]+)/$', TaskConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    # Django's ASGI application to handle traditional HTTP requests
    # "http": get_asgi_application(),
    "http": URLRouter([
        url(r'^_next/webpack-hmr', HMRHttpConsumer.as_asgi()),
        url(r"", get_asgi_application()),
    ]),

    # WebSocket chat handler
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
