<?php

namespace App\Support;

class ProductPlaceholder
{
    public const PUBLIC_PATH = 'images/product-not-found.svg';

    public static function url(): string
    {
        return asset(self::PUBLIC_PATH);
    }
}
