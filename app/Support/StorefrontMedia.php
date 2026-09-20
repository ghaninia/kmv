<?php

namespace App\Support;

use Spatie\MediaLibrary\MediaCollections\Models\Media;

final class StorefrontMedia
{
    /**
     * Path-only URL for SPA (same-origin), independent of APP_URL host.
     */
    public static function url(?Media $media): string
    {
        if ($media === null) {
            return ProductPlaceholder::publicPath();
        }

        return self::pathFromUrl($media->getUrl());
    }

    public static function pathFromUrl(?string $url): string
    {
        if ($url === null || trim($url) === '') {
            return ProductPlaceholder::publicPath();
        }

        $path = parse_url(trim($url), PHP_URL_PATH);
        if (is_string($path) && $path !== '' && str_starts_with($path, '/')) {
            return $path;
        }

        return trim($url);
    }
}
