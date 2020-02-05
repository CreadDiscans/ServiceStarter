from django.contrib import admin
from .models import *

class BoardGroupAdmin(admin.ModelAdmin):

    list_display = ('name',)

admin.site.register(BoardGroup, BoardGroupAdmin)
admin.site.register(BoardItem)