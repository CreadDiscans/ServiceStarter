from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, force_authenticate
class RequestFactoryWidthAuth(APIRequestFactory):

  def __init__(self):
    super().__init__()
    self.user = User()
    self.user.username = 'util_user'
    self.user.save()

  def get(self, path, data=None):
    request = super().get(path, data)
    force_authenticate(request, self.user)
    return request

  def post(self, path, data=None):
    request = super().post(path, data)
    force_authenticate(request, self.user)
    return request

  def put(self, path, data=None):
    request = super().put(path, data)
    force_authenticate(request, self.user)
    return request
  
  def patch(self, path, data=None):
    request = super().patch(path, data)
    force_authenticate(request, self.user)
    return request

  def delete(self, path, data=None):
    request = super().delete(path, data)
    force_authenticate(request, self.user)
    return request