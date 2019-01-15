
CASCADE = 'CASCADE'

class Field:
  def need(self):
    return None
  
  def serializer(self):
    return None

class CharField(Field):
  def __init__(self, max_length):
    self.max_length = max_length
  
  def toString(self):
    return '    %s = models.CharField(max_length='+str(self.max_length)+')\n'

class ForeignKey(Field):
  def __init__(self, foreign, on_delete, null=False, package=None, recursive=False):
    self.foreign = foreign
    self.package = package
    if package is None:
      self.foreign = '\'%s\''%foreign
    self.on_delete = on_delete
    self.null = null
    self.recursive = recursive
  
  def toString(self):
    param = '%s, on_delete=models.%s'%(self.foreign, self.on_delete)
    if self.null:
      param += ', null=True'
    return '    %s = models.ForeignKey('+param+')\n'

  def need(self):
    if self.package is not None:
      return {
        'type': 'import',
        'content': 'from %s import %s'%(self.package, self.foreign)
      }
    else:
      return None
  
  def serializer(self):
    if self.recursive:
      return {
        'type': 'recursive',
        'content': '''
  recursive_%s = serializers.SerializerMethodField()
  def get_recursive_%s(self, obj):
    return %sSerializer(%s.objects.filter(parent=obj).order_by('-id'), many=True).data\n'''
      }
    return None

class TextField(Field):
  def __init__(self, null):
    self.null = null

  def toString(self):
    return '    %s = models.TextField(null='+str(self.null)+')\n'

class DateTimeField(Field):
  def __init__(self, auto_now=False, auto_now_add=False):
    self.auto_now = auto_now
    self.auto_now_add = auto_now_add

  def toString(self):
    param = 'auto_now=%s, auto_now_add=%s'%(self.auto_now, self.auto_now_add)
    return '    %s = models.DateTimeField('+param+')\n'
