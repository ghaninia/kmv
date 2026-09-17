.PHONY: help setup init migrate fresh storage-link key-generate cache-clear optimize-clear build up down dev stop ps logs wait-vite vite-restart import-db

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
	@echo "  make up            - Start all containers and wait for Vite dev server"
	@echo "  make down          - Stop and remove all containers"
	@echo "  make dev           - Start dev environment with live frontend (HMR)"
	@echo "  make vite-restart  - Restart only the Vite dev server"
	@echo "  make import-db     - Re-import database/dumps/kmvpri_main.sql into MySQL"
	@echo "  make stop          - Stop all running containers"
	@echo "  make ps            - List running containers"
	@echo "  make logs          - Show logs from all containers"

setup: build up init
	@echo "Setup complete! Open http://localhost:8000"

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

wait-vite:
	@echo "Waiting for Vite dev server..."
	@for i in $$(seq 1 30); do \
		if [ -f public/hot ]; then \
			echo "Vite ready at $$(cat public/hot)"; \
			exit 0; \
		fi; \
		sleep 1; \
	done; \
	echo "Vite did not start. Run: docker-compose logs react"; \
	exit 1

up:
	docker-compose up -d
	@$(MAKE) wait-vite

down:
	docker-compose down
	@rm -f public/hot

dev: up
	@echo ""
	@echo "Dev environment is ready."
	@echo "  App (with HMR): http://localhost:8000"
	@echo "  Vite server:    http://localhost:5173"
	@echo ""
	@echo "Edit files in resources/application/ and changes appear instantly."
	@echo ""
	docker-compose logs -f

vite-restart:
	docker-compose restart react
	@$(MAKE) wait-vite

import-db:
	docker-compose up -d mysql
	@echo "Waiting for MySQL..."
	@for i in $$(seq 1 30); do \
		if docker-compose exec -T mysql mysqladmin ping -h localhost -ukmv -pkmv --silent 2>/dev/null; then \
			break; \
		fi; \
		sleep 2; \
	done
	docker-compose exec -T mysql mysql -ukmv -pkmv -e "DROP DATABASE IF EXISTS kmvpri_main; CREATE DATABASE kmvpri_main CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
	cat database/dumps/kmvpri_main.sql | docker-compose exec -T mysql mysql -ukmv -pkmv kmvpri_main
	@echo "Database import complete."

stop:
	docker-compose stop
	@rm -f public/hot

ps:
	docker-compose ps

logs:
	docker-compose logs -f
