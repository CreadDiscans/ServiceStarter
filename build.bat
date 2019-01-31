cd react
yarn build
cd ..
venv/bin/python manage.py migrate
venv/bin/python manage.py collectstatic --noinput