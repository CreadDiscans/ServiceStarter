from makeframe.core import fields

class BoardGroup:
  class Admin:
    pass
  name = fields.CharField(max_length=100)

class BoardItem:
  class Admin:
    inlines = ('BoardCommentInline',)
  group = fields.ForeignKey('BoardGroup', on_delete=fields.CASCADE)
  title = fields.CharField(max_length=100)
  content = fields.TextField(null=True)
  author = fields.ForeignKey('User', on_delete=fields.CASCADE, package='django.contrib.auth.models')
  created = fields.DateTimeField(auto_now=True)
  modified = fields.DateTimeField(auto_now_add=True)

class BoardComment:
  class Admin:
    type = 'TabularInline'
  item = fields.ForeignKey('BoardItem', on_delete=fields.CASCADE)
  parent = fields.ForeignKey('BoardComment', on_delete=fields.CASCADE, null=True, recursive=True)
  content = fields.TextField(null=True)
  author = fields.ForeignKey('User', on_delete=fields.CASCADE, package='django.contrib.auth.models')
  created = fields.DateTimeField(auto_now=True)
  modified = fields.DateTimeField(auto_now_add=True)

