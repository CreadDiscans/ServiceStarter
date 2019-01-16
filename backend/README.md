# 환경 구축

python 3.7 설치

python -m virtualenv venv

source venv/bin/activate

pip -U -r requirements.txt

python manage.py migrate

# model 생성

UML로 backend/models 폴더 및 파일 생성

python manage.py copymodels

python manage.py makemigrations

python manage.py migrate

# development mode

python manage.py runsslserver

# production mode 


