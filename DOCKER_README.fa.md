# پروژه لاراول داکری‌شده (KMV)

این یک پروژه لاراول کامل است که کاملا **داکری‌شده** و از **SQLite** به‌عنوان دیتابیس استفاده می‌کند.

## فایل‌های کلیدی

- **Dockerfile**: تصویر PHP 8.4 با PDO SQLite و Composer
- **docker-compose.yml**: تنظیم سرویس‌های Laravel (PHP) و Nginx
- **docker/nginx/default.conf**: پیکربندی Nginx برای لاراول
- **database/database.sqlite**: فایل دیتابیس SQLite

## شروع سریع

### ۱. راه‌اندازی سرویس‌ها
```bash
cd /home/robot/Desktop/projects/kmv
docker compose up -d
```

### ۲. بررسی وضعیت کانتینرها
```bash
docker compose ps
```

### ۳. دسترسی به برنامه
- **آدرس**: http://localhost:8080

### ۴. مشاهده لاگ‌ها
```bash
docker compose logs -f app
docker compose logs -f web
```

## فرمان‌های مفید

### Artisan Commands (داخل کانتینر)
```bash
docker compose exec app php artisan migrate
docker compose exec app php artisan tinker
docker compose exec app php artisan make:model Post -m
```

### مشاهده فایل‌های دیتابیس
دیتابیس SQLite در `database/database.sqlite` قرار دارد. از هر ابزار SQL بروی SQLite می‌توانید استفاده کنید.

### متوقف کردن سرویس‌ها
```bash
docker compose down
```

### حذف تمامی داده‌ها و کانتینرها
```bash
docker compose down -v
```

## تنظیمات محیط

فایل `.env` تمامی متغیرهای محیطی را تنظیم می‌کند:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
APP_URL=http://localhost:8080
```

## Nginx Configuration

پیکربندی Nginx در `docker/nginx/default.conf` قرار دارد:
- تمام درخواست‌ها به `public/index.php` هدایت می‌شوند
- SSL headers برای امنیت اضافه شده‌اند

## تصویر Docker

تصویر `kmv-laravel-app` شامل:
- **PHP 8.4-FPM**
- **Composer**
- **PDO SQLite**
- **XDebug** (برای debug)
- **تمام بسته‌های Laravel**

## ساختار پروژه

```
kmv/
├── app/                  # کد برنامه (Controllers, Models, etc)
├── bootstrap/            # فایل‌های Bootstrap
├── config/              # فایل‌های تنظیمات
├── database/            # Migrations و SQLite database
│   └── database.sqlite
├── docker/
│   └── nginx/
│       └── default.conf # تنظیمات Nginx
├── public/              # رابط عمومی (index.php, assets)
├── resources/           # Views و assets
├── routes/              # تعریف routes
├── storage/             # فایل‌های موقت و logs
├── .env                 # متغیرهای محیطی
├── Dockerfile           # تصویر Docker
└── docker-compose.yml   # سرویس‌های Docker
```

## نکات مهم

- تمام فایل‌های host در `/var/www/html` کانتینر mount شده‌اند
- دیتابیس SQLite خود‌کار ایجاد می‌شود
- Storage و cache دایرکتوری‌های تمیز و قابل‌نوشتن هستند
- PHP-FPM و Nginx در کانتینرهای جداگانه اجرا می‌شوند (best practices)

## مشکل‌گیری

### اگر کانتینرها start نشوند:
```bash
docker compose logs app
docker compose logs web
```

### اگر دیتابیس خالی است:
```bash
docker compose exec app php artisan migrate:fresh
```

### اگر درخواست‌ها 502 خطا می‌دهند:
بررسی کنید که `php-fpm` کار می‌کند:
```bash
docker compose ps
```

---

**توسط**: GitHub Copilot
**تاریخ**: 2026-06-20
