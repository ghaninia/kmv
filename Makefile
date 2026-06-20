.PHONY: help up down migrate seed fresh test install build dev install-local

help:
	@echo "Available commands:"
	@echo "  make install         - Install dependencies locally (npm & composer)"
	@echo "  make install-docker  - Setup everything with Docker"
	@echo "  make up              - Start Docker containers"
	@echo "  make down            - Stop Docker containers"
	@echo "  make migrate         - Run migrations in Docker"
	@echo "  make seed            - Run seeders in Docker"
	@echo "  make fresh           - Fresh migration + seed in Docker"
	@echo "  make test            - Run tests in Docker"
	@echo "  make dev             - Start development servers (Laravel + React)"
	@echo "  make build           - Build frontend assets"

# Local installation (no Docker required)
install: install-local

install-local:
	@echo "Installing dependencies locally..."
	composer install --no-interaction
	npm install
	@echo "✓ Dependencies installed"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Copy .env: cp .env.example .env"
	@echo "  2. Generate key: php artisan key:generate"
	@echo "  3. Setup database and run migrations"
	@echo "  4. Run: make dev"

# Docker installation
install-docker: up
	@echo "Installing PHP dependencies..."
	docker-compose exec -T app composer install --no-interaction
	@echo "Installing Node dependencies..."
	docker-compose exec -T app npm install
	@echo "✓ All dependencies installed in Docker"

# Docker commands
up:
	@if [ ! -f .env ]; then cp .env.example .env; fi
	docker-compose up -d
	@echo "✓ Docker containers started"
	@sleep 2
	@docker-compose exec -T app php artisan key:generate || true
	@docker-compose exec -T app touch database/database.sqlite || true

down:
	docker-compose down
	@echo "✓ Docker containers stopped"

# Database commands (Docker)
migrate:
	docker-compose exec app php artisan migrate
	@echo "✓ Migrations completed"

seed:
	docker-compose exec app php artisan db:seed
	@echo "✓ Database seeded"

fresh:
	docker-compose exec app php artisan migrate:fresh --seed
	@echo "✓ Database refreshed and seeded"

# Testing (Docker)
test:
	docker-compose exec app php artisan test
	@echo "✓ Tests completed"

# Development servers
dev:
	@echo "Starting development servers..."
	@echo "  - Laravel: http://localhost:8000"
	@echo "  - React (Vite): http://localhost:5173"
	@echo ""
	npm run dev & php artisan serve

# Frontend build
build:
	npm run build
	@echo "✓ Frontend build completed"

# Utilities (Docker)
artisan:
	docker-compose exec app php artisan $(CMD)

tinker:
	docker-compose exec app php artisan tinker

logs:
	docker-compose logs -f app

ps:
	docker-compose ps
