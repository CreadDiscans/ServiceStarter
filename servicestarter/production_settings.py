from .settings import *

DEBUG=True

ALLOWED_HOSTS = ['*']

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "react/build"),
]

WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': 'bundles/',
            'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.prod.json'),
        }
}

WEBPACK_TEMPLATE = 'index.prod.html'

# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
CORS_ALLOW_CREDENTIALS = False
CORS_ORIGIN_ALLOW_ALL = False