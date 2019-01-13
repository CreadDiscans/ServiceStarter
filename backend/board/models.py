from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class BoardGroup(models.Model):
  name = models.CharField(max_length=100)

class BoardItem(models.Model):
  group = models.ForeignKey(BoardGroup, on_delete=models.CASCADE)
  title = models.CharField(max_length=100)
  content = models.TextField(null=True)
  author = models.ForeignKey(User, on_delete=models.CASCADE)
  created = models.DateTimeField(auto_now=True)
  modified = models.DateTimeField(auto_now_add=True)

class BoardComment(models.Model):
  item = models.ForeignKey(BoardItem, on_delete=models.CASCADE)
  parent = models.ForeignKey('BoardComment', on_delete=models.CASCADE, null=True)
  content = models.TextField(null=True)
  author = models.ForeignKey(User, on_delete=models.CASCADE)
  created = models.DateTimeField(auto_now=True)
  modified = models.DateTimeField(auto_now_add=True)