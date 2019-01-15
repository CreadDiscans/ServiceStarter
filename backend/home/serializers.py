from django.contrib.auth.models import User, Group
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'groups', 'password')
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
        )
        if 'email' in validated_data: user.email = validated_data['email']
        if 'groups' in validated_data: user.groups = validated_data['groups']
        user.set_password(validated_data['password'])
        user.save()
        return user

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')