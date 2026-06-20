.PHONY: help setup build up down dev stop ps logs

help:
	@echo "Available commands:"
	@echo "  make setup    - Build images and setup the application"
	@echo "  make build    - Build Docker images"
	@echo "  make up       - Start all containers"
	@echo "  make down     - Stop and remove all containers"
	@echo "  make dev      - Start development environment"
	@echo "  make stop     - Stop all running containers"
	@echo "  make ps       - List running containers"
	@echo "  make logs     - Show logs from all containers"

setup: build up
	docker-compose exec -T app php artisan key:generate || true
	docker-compose exec -T app php artisan migrate --force || true
	@echo "Setup complete! React will install dependencies and start on port 5173"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

dev: up
	docker-compose logs -f

stop:
	docker-compose stop

ps:
	docker-compose ps

logs:
	docker-compose logs -f
