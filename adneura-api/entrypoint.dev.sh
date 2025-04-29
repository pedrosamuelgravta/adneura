set -e

python manage.py makemigrations --noinput
python manage.py migrate --noinput

exec python -u manage.py runserver 0.0.0.0:8000