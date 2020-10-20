import os
from config.base import *

SETTING_MODE = 'production'

# INSTALLED_APPS += ['sslserver']

DEBUG=True

ALLOWED_HOSTS = ['servicestarter.kro.kr', '*']

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "react/build"),
]

REACT_HOST = 'http://localhost:3001'


CSRF_COOKIE_SECURE = True
CORS_ALLOW_CREDENTIALS = False
CORS_ORIGIN_ALLOW_ALL = False
# SECURE_SSL_REDIRECT = True