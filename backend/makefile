venv:
	python3 -m venv venv

activate:
	source ./venv/bin/activate

deactivate:
	deactivate

install:
	pip install -r requirements.txt

start:
	uvicorn app.main:app --reload

worker:
	celery -A app.workers.celery_app worker --loglevel=info