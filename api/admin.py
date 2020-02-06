from django.contrib import admin
from django.dispatch import receiver
from django.db.models.signals import pre_delete
from .models import *

class BoardGroupAdmin(admin.ModelAdmin):
    list_display = ('name',)

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(BoardGroup, BoardGroupAdmin)
admin.site.register(Profile, ProfileAdmin)

@receiver(pre_delete, sender=Media)
def on_delete(sender, **kwargs):
    instance = kwargs['instance']
    instance.file.delete(False)