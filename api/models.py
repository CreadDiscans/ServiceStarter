from django.db import models

class Media(models.Model):
    class Meta:
        pass

    file = models.FileField(upload_to='%Y/%m/%d')
    boarditem = models.ForeignKey(on_delete=models.CASCADE, null=True, blank=True, to='BoardItem')
    shopproduct = models.ForeignKey(on_delete=models.CASCADE, null=True, blank=True, to='ShopProduct')
    profile = models.ForeignKey(on_delete=models.CASCADE, null=True, blank=True, to='Profile')
    extra = models.CharField(max_length=100, null=True, blank=True)


class Device(models.Model):
    class Meta:
        pass

    fcm_token = models.CharField(max_length=200)
    type = models.CharField(max_length=100)

    profile = models.ForeignKey('Profile', on_delete=models.CASCADE)

class Profile(models.Model):
    class Meta:
        verbose_name_plural='사용자'

    def __str__(self):
        return str(self.name)

    user = models.OneToOneField(to='auth.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    profile_img = models.CharField(max_length=200, null=True, blank=True)
    auth_token = models.CharField(max_length=500, null=True, blank=True)


class MonitorCpu(models.Model):
    class Meta:
        pass

    name = models.CharField(max_length=100)

    server = models.ForeignKey('MonitorServer', on_delete=models.CASCADE)

class MonitorUsage(models.Model):
    class Meta:
        pass

    percent = models.DecimalField(max_digits=5, decimal_places=2)
    dt = models.DateTimeField(auto_now_add=True)

    cpu = models.ForeignKey('MonitorCpu', on_delete=models.CASCADE, null=True, blank=True)
    memory = models.ForeignKey('MonitorMemory', on_delete=models.CASCADE, null=True, blank=True)

class MonitorMemory(models.Model):
    class Meta:
        pass

    total = models.IntegerField(default=0)

    server = models.OneToOneField('MonitorServer', on_delete=models.CASCADE)

class MonitorServer(models.Model):
    class Meta:
        pass

    address = models.CharField(max_length=100)
    keep_day = models.IntegerField(default=7)


class ChatRoom(models.Model):
    class Meta:
        pass

    user = models.ManyToManyField(to='Profile')


class ChatMessage(models.Model):
    class Meta:
        pass

    sender = models.ForeignKey(to='Profile', on_delete=models.SET_NULL, null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    room = models.ForeignKey('ChatRoom', on_delete=models.CASCADE)

class BoardComment(models.Model):
    class Meta:
        verbose_name_plural='게시판 댓글'

    content = models.TextField(null=True)
    created = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(on_delete=models.CASCADE, to='Profile')

    item = models.ForeignKey('BoardItem', on_delete=models.CASCADE)
    parent = models.ForeignKey('BoardComment', null=True, on_delete=models.CASCADE)

class BoardGroup(models.Model):
    class Meta:
        verbose_name_plural='게시판 그룹'

    def __str__(self):
        return str(self.name)

    name = models.CharField(max_length=100)
    readonly = models.BooleanField(default=False)


class BoardItem(models.Model):
    class Meta:
        verbose_name_plural='게시판 글'

    title = models.CharField(max_length=100, blank=True)
    content = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now=True)
    modified = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(on_delete=models.CASCADE, to='Profile')
    valid = models.BooleanField(default=False)

    group = models.ForeignKey('BoardGroup', on_delete=models.CASCADE)

class ShopBilling(models.Model):
    class Meta:
        verbose_name_plural='상점 구독내역'

    profile = models.ForeignKey(to='Profile', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    expired = models.DateTimeField()
    scheduled = models.BooleanField(default=False)
    imp_uid = models.CharField(max_length=100)
    merchant_uid = models.CharField(max_length=100)

    subscription = models.ForeignKey('ShopSubscription', on_delete=models.SET_NULL, null=True, blank=True)
    card = models.ForeignKey('ShopCard', on_delete=models.SET_NULL, null=True, blank=True)

class ShopCard(models.Model):
    class Meta:
        verbose_name_plural='상점 구독카드'

    name = models.CharField(max_length=100)
    customer_uid = models.CharField(max_length=100)
    profile = models.ForeignKey(to='Profile', on_delete=models.CASCADE)
    buyer_name = models.CharField(max_length=100)
    buyer_email = models.CharField(max_length=100)
    buyer_tel = models.CharField(max_length=100)


class ShopSubscription(models.Model):
    class Meta:
        verbose_name_plural='상점 구독'

    name = models.CharField(max_length=100)
    price = models.IntegerField(default=0)
    valid = models.BooleanField(default=False)


class ShopProduct(models.Model):
    class Meta:
        verbose_name_plural='상점 상품'

    name = models.CharField(max_length=100)
    price = models.IntegerField(default=0)
    valid = models.BooleanField(default=False)
    content = models.TextField(null=True, blank=True)


class ShopPayment(models.Model):
    class Meta:
        verbose_name_plural='상점 결재내역'

    imp_uid = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    vbank = models.CharField(max_length=100, null=True, blank=True)

    cart = models.OneToOneField('ShopCart', on_delete=models.SET_NULL, null=True, blank=True)

class ShopCart(models.Model):
    class Meta:
        verbose_name_plural='상점 장바구니'

    isOpen = models.BooleanField(default=True)
    profile = models.ForeignKey(on_delete=models.CASCADE, to='Profile')

    product = models.ManyToManyField('ShopProduct', blank=True)

class TaskWork(models.Model):
    class Meta:
        pass

    owner = models.ForeignKey(to='Profile', on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    status = models.CharField(max_length=100)
    body = models.TextField(null=True, blank=True)


class TaskClient(models.Model):
    class Meta:
        pass

    channel_name = models.CharField(max_length=100)

    work = models.ForeignKey('TaskWork', on_delete=models.CASCADE)

