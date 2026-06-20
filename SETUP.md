# Admin Dashboard System - Setup Guide

A professional Laravel admin dashboard with React + Tailwind CSS frontend for managing products, categories, and catalogs with dynamic pricing.

## Features

### Authentication
- Admin login/logout
- Session-based authentication
- User management (single admin user)

### Product Management
- Create, read, update, delete products
- Multiple image uploads per product
- Image gallery management
- Product categorization
- Price management in USD (stored as cents)

### Category Management
- Create, read, update, delete categories
- Category-based product filtering
- Status management (active/inactive)

### Catalog System
- Create multiple catalogs
- Attach products to catalogs with custom pricing
- Many-to-many relationships
- Different prices for same product in different catalogs

### Public Sharing
- Generate short public URLs for catalogs
- Password protection for shared catalogs
- Expiration dates for links
- Secure access control

### Currency Management
- USD to Toman exchange rate tracking
- Automatic daily rate updates via scheduler
- Rate history logging
- Manual rate updates

### Dashboard
- Overview statistics
- Quick action links
- Real-time USD rate display
- Responsive design

## Tech Stack

### Backend
- Laravel 13+
- PHP 8.3+
- MySQL/PostgreSQL
- Eloquent ORM
- Laravel Sanctum (API authentication)
- Spatie Media Library (file management)

### Frontend
- React 18+
- React Router v6
- Tailwind CSS 4
- Zustand (state management)
- Axios (HTTP client)
- Lucide React (icons)

### Testing
- PHPUnit
- Feature Tests
- Database Factories & Seeders

## Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Composer
- PHP 8.3+

### Quick Start

1. **Clone and setup:**
```bash
git clone <repository>
cd kmv
make install
```

2. **Start containers:**
```bash
make up
```

3. **Setup database:**
```bash
make fresh
```

4. **Start development servers:**
```bash
make dev
```

The application will be available at `http://localhost:8000`

### Manual Installation (without Docker)

1. **Install PHP dependencies:**
```bash
composer install
```

2. **Install Node dependencies:**
```bash
npm install
```

3. **Setup environment:**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database** in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=admin_dashboard
DB_USERNAME=root
DB_PASSWORD=
```

5. **Run migrations and seed:**
```bash
php artisan migrate:fresh --seed
```

6. **Start development:**
```bash
php artisan serve
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Categories
- `GET /api/categories` - List categories (paginated)
- `POST /api/categories` - Create category
- `GET /api/categories/{id}` - Get category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Products
- `GET /api/products` - List products (paginated)
- `POST /api/products` - Create product with images
- `GET /api/products/{id}` - Get product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `POST /api/products/{id}/delete-image` - Delete image
- `POST /api/products/{id}/reorder-gallery` - Reorder gallery

### Catalogs
- `GET /api/catalogs` - List catalogs (paginated)
- `POST /api/catalogs` - Create catalog
- `GET /api/catalogs/{id}` - Get catalog
- `PUT /api/catalogs/{id}` - Update catalog
- `DELETE /api/catalogs/{id}` - Delete catalog
- `GET /api/catalogs/{id}/products` - Get catalog products
- `POST /api/catalogs/{id}/attach-products` - Attach products
- `DELETE /api/catalogs/{id}/products/{product}` - Detach product
- `PATCH /api/catalogs/{id}/products/{product}/price` - Update product price
- `POST /api/catalogs/{id}/links` - Create public link
- `GET /api/catalogs/{id}/links` - Get catalog links
- `DELETE /api/catalogs/{id}/links` - Delete link

### Currency
- `GET /api/currency/rate` - Get current USD rate
- `POST /api/currency/rate` - Update USD rate
- `GET /api/currency/history` - Get rate history

### Public API
- `GET /api/catalog/{shortCode}` - Access public catalog (no auth required)

## Makefile Commands

```bash
make help          # Show all available commands
make up            # Start Docker containers
make down          # Stop Docker containers
make install       # Install dependencies
make migrate       # Run migrations
make seed          # Run seeders
make fresh         # Fresh migration + seed
make test          # Run tests
make dev           # Start development server
make build         # Build frontend assets
```

## Database Schema

### Users
- id, name, email, password, email_verified_at, remember_token

### Categories
- id, name, slug, description, status, timestamps

### Products
- id, category_id, name, slug, description, base_price_usd, status, timestamps

### Catalogs
- id, name, slug, description, status, timestamps

### Catalog Products (pivot)
- id, catalog_id, product_id, custom_price_usd, timestamps

### Catalog Links
- id, catalog_id, short_code, password_hash, expires_at, timestamps

### Media (for images)
- id, model_type, model_id, collection_name, name, file_name, disk, size, timestamps

### Settings
- id, key, value, timestamps

### Currency Logs
- id, currency, rate, source, requested_at, timestamps

## Testing

Run the test suite:
```bash
php artisan test
```

Test specific class:
```bash
php artisan test tests/Feature/AuthenticationTest.php
```

Tests include:
- Authentication (login, logout)
- Category management
- Product management
- Catalog management
- Public catalog access
- Currency management

## File Structure

```
app/
├── Console/
│   ├── Commands/
│   │   └── UpdateCurrencyCommand.php
│   └── Kernel.php
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── AuthController.php
│   │   │   ├── CatalogController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── CurrencyController.php
│   │   │   ├── DashboardController.php
│   │   │   └── ProductController.php
│   │   └── CatalogPublicController.php
│   ├── Requests/
│   │   ├── AttachProductsToCatalogRequest.php
│   │   ├── CreateCatalogLinkRequest.php
│   │   ├── LoginRequest.php
│   │   ├── StoreCatalogRequest.php
│   │   ├── StoreCategoryRequest.php
│   │   ├── StoreProductRequest.php
│   │   ├── UpdateCatalogRequest.php
│   │   ├── UpdateCategoryRequest.php
│   │   └── UpdateProductRequest.php
│   └── Resources/
│       ├── CatalogResource.php
│       ├── CategoryResource.php
│       └── ProductResource.php
├── Models/
│   ├── Catalog.php
│   ├── CatalogLink.php
│   ├── Category.php
│   ├── CurrencyLog.php
│   ├── Product.php
│   ├── Setting.php
│   └── User.php
├── Services/
│   ├── CatalogLinkService.php
│   ├── CatalogService.php
│   ├── CurrencyService.php
│   └── ProductService.php

resources/
├── js/
│   ├── api/
│   │   └── index.js
│   ├── components/
│   │   ├── DataTable.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── LoginPage.jsx
│   ├── store/
│   │   ├── appStore.js
│   │   └── authStore.js
│   ├── App.jsx
│   ├── app.js
│   └── bootstrap.js
```

## Default Credentials

- Email: `admin@example.com`
- Password: `password`

## Environment Variables

Key environment variables in `.env`:
```env
APP_NAME=Admin Dashboard
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=admin_dashboard
DB_USERNAME=root
DB_PASSWORD=

MEDIA_DISK=public
```

## Daily Scheduler

The application includes a daily scheduler to update USD exchange rates:

```bash
php artisan schedule:run
```

Or use the command directly:
```bash
php artisan currency:update
```

To test the scheduler:
```bash
php artisan make:test ScheduleTest --unit
```

## Media Library Configuration

Images are stored using Spatie's Media Library:
- Collection: `gallery`
- Disk: `public`
- Fallback: `storage/placeholders/product.jpg`

## API Response Format

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "data": { ... }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "errors": { ... }
}
```

### Paginated Response
```json
{
    "data": [ ... ],
    "pagination": {
        "total": 100,
        "count": 15,
        "per_page": 15,
        "current_page": 1,
        "last_page": 7
    }
}
```

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check `.env` database credentials
- Run migrations: `php artisan migrate`

### Frontend Not Loading
- Build assets: `npm run build`
- Clear cache: `npm cache clean --force`
- Reinstall: `npm install`

### API Not Responding
- Check Laravel is running: `php artisan serve`
- Check routes: `php artisan route:list`
- Check CORS configuration

## Security Notes

- Admin authentication required for all operations
- Password hashing using Laravel's hash helper
- CSRF protection enabled
- API rate limiting recommended for production
- Always use HTTPS in production
- Store sensitive data in environment variables

## Production Deployment

1. Build frontend:
```bash
npm run build
```

2. Optimize Laravel:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. Set queue worker (optional):
```bash
php artisan queue:work
```

4. Setup scheduler in crontab:
```bash
* * * * * cd /path/to/app && php artisan schedule:run >> /dev/null 2>&1
```

## Support & Documentation

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Spatie Media Library](https://spatie.be/docs/laravel-medialibrary/v13/introduction)

## License

MIT License

---

**Project created for professional admin dashboard management.**
