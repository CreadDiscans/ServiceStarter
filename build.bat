cd react
npm run build
cd ..
venv/bin/python manage.py migrate
venv/bin/python manage.py collectstatic --noinput