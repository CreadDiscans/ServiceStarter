from django.db import models

class Profile(models.Model):
    class Meta:
        verbose_name_plural='사용자'

    user = models.OneToOneField(to='auth.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)


class Media(models.Model):
    class Meta:
        pass

    file = models.FileField(upload_to='%Y/%m/%d')

    boarditem = models.ForeignKey('BoardItem', null=True, on_delete=models.CASCADE)

class BoardGroup(models.Model):
    class Meta:
        verbose_name_plural='게시판 그룹'

    name = models.CharField(max_length=100)


class BoardItem(models.Model):
    class Meta:
        verbose_name_plural='게시글'

    title = models.CharField(max_length=100, blank=True)
    content = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now=True)
    modified = models.DateTimeField(auto_now_add=True)
    author_name = models.CharField(max_length=100)
    valid = models.BooleanField(default=False)

    group = models.ForeignKey('BoardGroup', on_delete=models.CASCADE)
    author = models.ForeignKey('Profile', on_delete=models.CASCADE)

class BoardComment(models.Model):
    class Meta:
        verbose_name_plural='댓글'

    content = models.TextField(null=True)
    created = models.DateTimeField(auto_now=True)
    author_name = models.CharField(max_length=100)

    item = models.ForeignKey('BoardItem', on_delete=models.CASCADE)
    parent = models.ForeignKey('BoardComment', null=True, on_delete=models.CASCADE)
    author = models.ForeignKey('Profile', on_delete=models.CASCADE)

