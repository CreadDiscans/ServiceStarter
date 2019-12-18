import os
from config.settings import *

SETTING_MODE = 'staging'

DEBUG=True

ALLOWED_HOSTS = ['*']

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "react/build"),
]

REACT_HOST = 'http://localhost:3001'

CSRF_COOKIE_SECURE = True
CORS_ALLOW_CREDENTIALS = False
CORS_ORIGIN_ALLOW_ALL = False