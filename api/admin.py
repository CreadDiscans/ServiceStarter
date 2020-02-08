from django.contrib import admin
from django.core.files import File
from django.dispatch import receiver
from django.db.models.signals import pre_delete
from django import forms
from django.conf import settings
from ckeditor.widgets import CKEditorWidget
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from .models import *
import os
import random
import string
class BoardGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'readonly')

class BoardItemForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget())
    class Meta:
        model = BoardItem
        fields = '__all__'
class BoardItemAdmin(admin.ModelAdmin):
    list_display = ('group', 'title', )
    form = BoardItemForm
    def save_model(self, request, obj, form, change):
        result = super(BoardItemAdmin, self).save_model(request, obj, form, change)
        save_media('boarditem', obj, 'content')
        return result
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name',)

class ShopProductForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget())
    class Meta:
        model = ShopProduct
        fields = '__all__'
class ShopProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'valid')
    form = ShopProductForm
    def save_model(self, request, obj, form, change):
        result = super(ShopProductAdmin, self).save_model(request, obj, form, change)
        save_media('shopproduct', obj, 'content')
        return result

admin.site.register(BoardGroup, BoardGroupAdmin)
admin.site.register(BoardItem, BoardItemAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(ShopProduct, ShopProductAdmin)
@receiver(pre_delete, sender=Media)
def on_delete(sender, **kwargs):
    instance = kwargs['instance']
    instance.file.delete(False)

def save_media(key, obj, field):
    attr = 'src="/media%s"'
    for root, _, files in os.walk(os.path.join(settings.MEDIA_ROOT, settings.CKEDITOR_UPLOAD_PATH)):
        for file in files:
            fullname = os.path.join(root, file)
            local_file = open(fullname, 'rb')
            djangofile = File(local_file)
            newname = ''.join([random.choice(string.ascii_letters) for i in range(20)])
            ext = os.path.splitext(file)[-1]
            djangofile.name = newname
            m = Media()
            m.file.save(newname + ext, djangofile)
            setattr(m, key, obj)
            m.save()
            local_file.close()
            os.remove(fullname)
            src = fullname.replace(settings.MEDIA_ROOT, '')
            setattr(obj, field, getattr(obj, field).replace(attr%src, attr%('/'+m.file.name)))
    obj.save()