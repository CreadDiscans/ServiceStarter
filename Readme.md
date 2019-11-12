# Development

export UML.mdj to django models in Star UML
(https://github.com/CreadDiscans/staruml-django)

cd react && npm install && cd ..

pip install -r requirements.txt
python manage.py copymodels
python manage.py makemigrations
python manage.py migrate
python manage.py start

# Production

docker-compose down && docker-compose up -d --build

# License

The project is commercial license. 
If you want to be supported, please contact CreadDiscans@gmail.com.