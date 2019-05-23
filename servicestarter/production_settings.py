from .settings import *

SETTING_MODE = 'production'

DEBUG=True

ALLOWED_HOSTS = ['*']

REACT_HOST = 'http://localhost:3001'

# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
CORS_ALLOW_CREDENTIALS = False
CORS_ORIGIN_ALLOW_ALL = False