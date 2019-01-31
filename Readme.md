startUML 설치, starUML extension 설치 (https://github.com/CreadDiscans/staruml-django)

ERD 설계 (UML.mdj 참고)

python -m virtualenv venv

source venv/bin/activate

pip install -U -r requirements.txt

python manage.py copymodels

python manage.py makemigrations

python manage.py migrate

python manage.py runserver

cd react

npm install

npm install -g react-scripts

yarn start
