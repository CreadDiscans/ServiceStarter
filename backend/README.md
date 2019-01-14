# 환경 구축

python 3.7 설치

python -m virtualenv venv

source venv/bin/activate

pip -U -r requirements.txt

python manage.py migrate

# model 생성

python manage.py makeframe

# development mode

python manage.py runsslserver

# production mode 


