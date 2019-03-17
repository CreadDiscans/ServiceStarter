# Django Development Guide

install startUML(http://staruml.io/)

install starUML extension (https://github.com/CreadDiscans/staruml-django)

design ERD (refer to UML.mdj)

python -m virtualenv venv

source venv/bin/activate

pip install -U -r requirements.txt

python manage.py copymodels

python manage.py makemigrations

python manage.py migrate

python manage.py runserver

# React Development Guide

cd react

npm install

npm install -g react-scripts

npm start (for realtime react development)

npm run build (for frontend rendered by django)