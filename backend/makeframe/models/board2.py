from makeframe.core import fields

class Board2Group:
  name = fields.CharField(max_length=100)

class Board2Item:
  group = fields.ForeignKey('Board2Group', on_delete=fields.CASCADE)
  title = fields.CharField(max_length=100)
  content = fields.TextField(null=True)
  author = fields.ForeignKey('User', on_delete=fields.CASCADE, package='django.contrib.auth.models')
  created = fields.DateTimeField(auto_now=True)
  modified = fields.DateTimeField(auto_now_add=True)

class Board2Comment:
  item = fields.ForeignKey('Board2Item', on_delete=fields.CASCADE)
  parent = fields.ForeignKey('Board2Comment', on_delete=fields.CASCADE, null=True)
  content = fields.TextField(null=True)
  author = fields.ForeignKey('User', on_delete=fields.CASCADE, package='django.contrib.auth.models')
  created = fields.DateTimeField(auto_now=True)
  modified = fields.DateTimeField(auto_now_add=True)