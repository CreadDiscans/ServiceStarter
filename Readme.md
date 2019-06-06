# Development

export URL to django models in Star UML

pip install -r requirements.txt
cd react && npm install

python manage.py copymodels
python manage.py makemigrations
python manage.py migrate
python manage.py start

# Production

docker-compose up -d