# Development

export UML.mdj to django models in Star UML
(https://github.com/CreadDiscans/staruml-django)

- cd react && npm install && cd ..
- pip install -r requirements.txt
- python manage.py copymodels
- python manage.py makemigrations
- python manage.py migrate
- python manage.py start

# Production

fix ssl domain
- config/service/nginx.conf
- config/service/supervisor.conf
- config/production/settings.py

docker-compose down && docker-compose up -d --build

![architecture](./assest/architecture.png)

# React Native

Server
- change config/base.py FCM_SERVER_KEY

Android
- change android/app/google-services.json
- update android/app/src/main/res/values/string.xml RNB_GOOGLE_PLAY_LICENSE_KEY string

# License

The project is commercial license. 
If you want to be supported, please contact CreadDiscans@gmail.com.

