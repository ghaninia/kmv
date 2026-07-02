.PHONY: help setup init migrate fresh storage-link key-generate cache-clear optimize-clear build up down dev stop ps logs

help:
	@echo "Available commands:"
	@echo "  make setup         - Build images and setup the application"
	@echo "  make init          - Run app init tasks (key, storage:link, migrate, clear caches)"
	@echo "  make migrate       - Run database migrations"
	@echo "  make fresh         - Recreate database and run seeders"
	@echo "  make storage-link  - Create the storage symbolic link"
	@echo "  make key-generate  - Generate the application key"
	@echo "  make cache-clear   - Clear application caches"
	@echo "  make optimize-clear- Clear all cached bootstrap files"
	@echo "  make build         - Build Docker images"
	@echo "  make up            - Start all containers"
	@echo "  make down          - Stop and remove all containers"
	@echo "  make dev           - Start development environment"
	@echo "  make stop          - Stop all running containers"
	@echo "  make ps            - List running containers"
	@echo "  make logs          - Show logs from all containers"

setup: build up init
	@echo "Setup complete! React will install dependencies and start on port 5173"

init:
	docker-compose exec -T app composer install --no-interaction
	docker-compose exec -T app php artisan key:generate || true
	docker-compose exec -T app php artisan storage:link || true
	docker-compose exec -T app php artisan migrate --force || true
	docker-compose exec -T app php artisan config:clear || true
	docker-compose exec -T app php artisan cache:clear || true
	docker-compose exec -T app php artisan route:clear || true
	docker-compose exec -T app php artisan view:clear || true
	@echo "Application initialized!"

migrate:
	docker-compose exec -T app php artisan migrate --force

fresh:
	docker-compose exec -T app php artisan migrate:fresh --seed --force

storage-link:
	docker-compose exec -T app php artisan storage:link

key-generate:
	docker-compose exec -T app php artisan key:generate

cache-clear:
	docker-compose exec -T app php artisan cache:clear
	docker-compose exec -T app php artisan config:clear
	docker-compose exec -T app php artisan route:clear
	docker-compose exec -T app php artisan view:clear

optimize-clear:
	docker-compose exec -T app php artisan optimize:clear

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
