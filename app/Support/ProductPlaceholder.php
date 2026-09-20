<?php

namespace App\Support;

class ProductPlaceholder
{
    public const PUBLIC_PATH = 'images/not-found.png';

    public static function url(): string
    {
        return asset(self::PUBLIC_PATH);
    }
}
