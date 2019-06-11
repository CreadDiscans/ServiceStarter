# Development

export UML.mdj to django models in Star UML

pip install -r requirements.txt
cd react && npm install

python manage.py copymodels
python manage.py makemigrations
python manage.py migrate
python manage.py start

 - Ignore 3000 port, Use 8000 port

# Production

docker-compose up -d

