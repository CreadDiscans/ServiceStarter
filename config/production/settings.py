import os
from config.base import *

SETTING_MODE = 'production'

# INSTALLED_APPS += ['sslserver']

DEBUG=True

ALLOWED_HOSTS = ['servicestarter.kro.kr', '*']

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "nextjs/build"), os.path.join(BASE_DIR, 'nextjs/public')
]

REDIS_HOST = 'localhost'
REDIS_PASSWORD = 'redispassword'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [("redis://:%s@%s:6379/0"%(REDIS_PASSWORD,REDIS_HOST))]
        }
    }
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://%s:6379/1"%REDIS_HOST, # 1번 DB
        "OPTIONS": {
            "PASSWORD": REDIS_PASSWORD,
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

CELERY_BROKER_URL  = 'redis://:%s@%s:6379/0'%(REDIS_PASSWORD,REDIS_HOST)
CELERY_RESULT_BACKEND = 'redis://:%s@%s:6379/0'%(REDIS_PASSWORD,REDIS_HOST)

REACT_HOST = 'http://localhost:3001'


CSRF_COOKIE_SECURE = True
CORS_ALLOW_CREDENTIALS = False
CORS_ORIGIN_ALLOW_ALL = False
# SECURE_SSL_REDIRECT = True