from __future__ import absolute_import, unicode_literals
from celery import shared_task
from datetime import datetime
from django.conf import settings

@shared_task
def debug():
    now = datetime.now()
    print(now, settings.SETTING_MODE)

# from channels.layers import get_channel_layer

# channel_layer = get_channel_layer()
# await channel_layer.send("channel_name", {
#     "type": "chat.message",
#     "text": "Hello there!",
# })