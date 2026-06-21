FROM php:8.2-fpm

RUN apt-get update && apt-get install -y --no-install-recommends \
    libonig-dev \
    libzip-dev \
    libsqlite3-dev \
    sqlite3 \
    zip \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_sqlite zip exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

COPY . .

RUN php -r "file_exists('.env') || copy('.env.example', '.env');" \
    && composer install --no-dev --optimize-autoloader

RUN mkdir -p storage/framework/cache/data \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
