from makeframe.core import fields

class BoardGroup2:
  name = fields.CharField(max_length=100)

class BoardItem2:
  group = fields.ForeignKey('BoardGroup2', on_delete=fields.CASCADE)
  title = fields.CharField(max_length=100)
  content = fields.TextField(null=True)
  author = fields.ForeignKey('User', on_delete=fields.CASCADE, package='django.contrib.auth.models')
  created = fields.DateTimeField(auto_now=True)
  modified = fields.DateTimeField(auto_now_add=True)

class BoardComment2:
  item = fields.ForeignKey('BoardItem2', on_delete=fields.CASCADE)
  parent = fields.ForeignKey('BoardComment2', on_delete=fields.CASCADE, null=True)
  content = fields.TextField(null=True)
  author = fields.ForeignKey('User', on_delete=fields.CASCADE, package='django.contrib.auth.models')
  created = fields.DateTimeField(auto_now=True)
  modified = fields.DateTimeField(auto_now_add=True)