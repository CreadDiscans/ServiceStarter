from django.db import models

class Profile(models.Model):
    class Meta:
        verbose_name_plural='사용자'

    def __str__(self):
        return self.name

    user = models.OneToOneField(to='auth.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)


class Media(models.Model):
    class Meta:
        pass

    file = models.FileField(upload_to='%Y/%m/%d')
    boarditem = models.ForeignKey(on_delete=models.CASCADE, null=True, blank=True, to='BoardItem')
    shopproduct = models.ForeignKey(on_delete=models.CASCADE, null=True, blank=True, to='ShopProduct')


class BoardGroup(models.Model):
    class Meta:
        verbose_name_plural='게시판 그룹'

    def __str__(self):
        return self.name

    name = models.CharField(max_length=100)
    readonly = models.BooleanField(default=False)


class BoardItem(models.Model):
    class Meta:
        verbose_name_plural='게시글'

    title = models.CharField(max_length=100, blank=True)
    content = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now=True)
    modified = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(on_delete=models.CASCADE, to='Profile')
    author_name = models.CharField(max_length=100)
    valid = models.BooleanField(default=False)

    group = models.ForeignKey('BoardGroup', on_delete=models.CASCADE)

class BoardComment(models.Model):
    class Meta:
        verbose_name_plural='댓글'

    content = models.TextField(null=True)
    created = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(on_delete=models.CASCADE, to='Profile')
    author_name = models.CharField(max_length=100)

    item = models.ForeignKey('BoardItem', on_delete=models.CASCADE)
    parent = models.ForeignKey('BoardComment', null=True, on_delete=models.CASCADE)

class ShopCart(models.Model):
    class Meta:
        verbose_name_plural='장바구니'

    isOpen = models.BooleanField(default=True)
    profile = models.ForeignKey(on_delete=models.CASCADE, to='Profile')

    product = models.ManyToManyField('ShopProduct', blank=True)

class ShopPayment(models.Model):
    class Meta:
        verbose_name_plural='결재내역'

    imp_uid = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    vbank = models.CharField(max_length=100, null=True, blank=True)

    cart = models.OneToOneField('ShopCart', on_delete=models.SET_NULL, null=True, blank=True)

class ShopProduct(models.Model):
    class Meta:
        verbose_name_plural='상품'

    name = models.CharField(max_length=100)
    price = models.IntegerField(default=0)
    valid = models.BooleanField(default=False)
    content = models.TextField(null=True, blank=True)


