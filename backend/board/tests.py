from django.test import TestCase
from django.contrib.auth.models import User
from home.utils import RequestFactoryWidthAuth
from board.views import BoardGroupViewSet, BoardItemViewSet, BoardCommentViewSet
from board.models import BoardGroup, BoardItem, BoardComment

# Create your tests here.
class BoardTest(TestCase):

  def setUp(self):
    self.factory = RequestFactoryWidthAuth()
    self.item = BoardItemViewSet.as_view({
      'get': 'list'
    })
    self.comment = BoardCommentViewSet.as_view({
      'get': 'list',
      'post': 'create'
    })
    self.user = User()
    self.user.username = 'board_user'
    self.user.save()

  def test_item_pagination(self):
    g = BoardGroup()
    g.name = 'test_item_pagination'
    g.save()
    for i in range(50):
      item = BoardItem()
      item.title = 'test_item'
      item.author = self.user
      item.group = g
      item.save()
    res = self.item(self.factory.get('/api/board/item', {
      'page':2
    }))
    self.assertEqual(res.data['totalPages'], 5)
    self.assertEqual(res.data['items'][0]['id'],40)

  def test_item_group_filter(self):
    groups = []
    for i in range(2):
      g = BoardGroup()
      g.name = 'test_item_group_filter_%s'%i
      g.save()
      groups.append(g)
    
    def make_boardItem(group):
      item = BoardItem()
      item.title = 'test_item'
      item.author = self.user
      item.group = group
      item.save()

    for i in range(10):
      make_boardItem(groups[0])
    
    for i in range(30):
      make_boardItem(groups[1])
    res = self.item(self.factory.get('/api/board/item', {
      'page':1,
      'group_id': groups[0].id
    }))
    self.assertEqual(res.data['totalPages'], 1)
    res = self.item(self.factory.get('/api/board/item', {
      'page':1,
      'group_id': groups[1].id
    }))
    self.assertEqual(res.data['totalPages'], 3)
    
  def test_comment_item_filter(self):
    g = BoardGroup()
    g.name = 'test_comment_item_filter'
    g.save()
    
    items = []
    for i in range(2):
      item = BoardItem()
      item.title = 'test_item'
      item.author = self.user
      item.group = g
      item.save()
      items.append(item)
    
    def make_boardComment(item):
      comment = BoardComment()
      comment.item = item
      comment.author = self.user
      comment.save()

    for i in range(5):
      make_boardComment(items[0])

    for i in range(10):
      make_boardComment(items[1])

    res = self.comment(self.factory.get('/api/board/comment', {
      'item_id': items[0].id
    }))
    self.assertEqual(len(res.data), 5)
    res = self.comment(self.factory.get('/api/board/comment', {
      'item_id': items[1].id
    }))
    self.assertEqual(len(res.data), 10)

  def test_nest_comment(self):
    g = BoardGroup()
    g.name = 'test_comment_item_filter'
    g.save()

    item = BoardItem()
    item.title = 'test_item'
    item.author = self.user
    item.group = g
    item.save()
    
    comment = BoardComment()
    comment.item = item
    comment.author = self.user
    comment.save()

    res = self.comment(self.factory.post('/api/board/comment', {
      'content': 'nest_comment',
      'item': item.id,
      'author': self.user.id,
      'parent': comment.id
    }))
    res = self.comment(self.factory.get('/api/board/comment', {
      'item_id': item.id
    }))
    self.assertEqual(len(res.data), 1)
    self.assertEqual(len(res.data[0]['children']), 1)

