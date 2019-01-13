from django.contrib.auth.models import User, Group
from rest_framework import serializers
from board import models

class BoardGroupSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.BoardGroup
    fields = '__all__'


class BoardItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.BoardItem
    fields = '__all__'

class BoardCommentSerializer(serializers.ModelSerializer):
  children = serializers.SerializerMethodField()

  class Meta:
    model = models.BoardComment
    fields = '__all__'

  def get_children(self, obj):
    children = models.BoardComment.objects.filter(parent=obj).order_by('-id')
    return BoardCommentSerializer(children, many=True).data