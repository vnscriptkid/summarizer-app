# Only start postgres and redis containers
up_db:
	docker-compose -f docker-compose.yml up -d postgres redis

down:
	docker-compose -f docker-compose.yml down --volumes --remove-orphans

psql:
	docker-compose -f docker-compose.yml exec postgres psql -U postgres -d summarizer