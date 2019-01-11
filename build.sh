cd frontend
npm install
yarn build:server
yarn build
cd ..

cd backend
./venv/bin/python -m pip install -U -r requirements.txt
./venv/bin/python manage.py migrate
cd ..
