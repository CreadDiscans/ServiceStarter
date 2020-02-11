from channels.generic.websocket import AsyncWebsocketConsumer
from api.models import ChatRoom, ChatMessage, Profile
from api.views import getSerializer
import json

class MessageConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'room_%s' % self.room_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        profile = Profile.objects.get(pk=text_data_json['sender'])
        room = ChatRoom.objects.get(pk=text_data_json['room'])
        message = ChatMessage(
            room=room,
            created=text_data_json['created'],
            sender=profile,
            content=text_data_json['content']
        )
        message.save()
        message_ser = getSerializer(ChatMessage)(message)
        profile_ser = getSerializer(Profile)(profile)
        out = message_ser.data
        out['sender'] = profile_ser.data
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'room_message',
                'message': out
            }
        )

    async def room_message(self, event):
        await self.send(text_data=json.dumps(event['message']))