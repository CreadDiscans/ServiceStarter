from django.contrib import admin
from board import models
# Register your models here.

class BoardCommentInline(admin.TabularInline):
  model = models.BoardComment

class BoardItemAdmin(admin.ModelAdmin):
  model = models.BoardItem
  inlines = (BoardCommentInline,)

admin.site.register(models.BoardGroup)
admin.site.register(models.BoardItem, BoardItemAdmin)