<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class StorefrontPagination
{
    /** کاروسل و بلوک محصولات صفحه اصلی */
    public const HOMEPAGE_MAX_ITEMS = 8;

    /** لیست فروشگاه (محصولات / دسته) */
    public const LISTING_PER_PAGE = 12;

    public const LISTING_MAX_PAGES = 50;

    /** @deprecated use HOMEPAGE_MAX_ITEMS */
    public const MAX_ITEMS = self::HOMEPAGE_MAX_ITEMS;

    /** @deprecated use LISTING_PER_PAGE */
    public const PER_PAGE = self::LISTING_PER_PAGE;

    /** @deprecated */
    public const MAX_PAGES = 2;

    public static function homepageMaxItems(): int
    {
        return self::HOMEPAGE_MAX_ITEMS;
    }

    /**
     * @param  Builder<\Illuminate\Database\Eloquent\Model>  $query
     */
    public static function paginateListing(Builder $query, int $page): LengthAwarePaginator
    {
        $perPage = self::LISTING_PER_PAGE;
        $total = (clone $query)->count();
        $lastPage = $total > 0
            ? min(self::LISTING_MAX_PAGES, (int) ceil($total / $perPage))
            : 1;
        $page = min(max($page, 1), $lastPage);

        $items = (clone $query)->forPage($page, $perPage)->get();

        return new LengthAwarePaginator(
            $items,
            $total,
            $perPage,
            $page,
        );
    }

    /**
     * @param  Builder<\Illuminate\Database\Eloquent\Model>  $query
     * @deprecated
     */
    public static function paginate(Builder $query, int $page): LengthAwarePaginator
    {
        return self::paginateListing($query, $page);
    }
}
