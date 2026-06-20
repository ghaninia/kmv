<?php

namespace App\Services;

use App\Models\Catalog;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class CatalogService
{
    /**
     * Attach products to catalog
     */
    public function attachProducts(Catalog $catalog, array $products): void
    {
        $attachData = [];

        foreach ($products as $product) {
            $attachData[$product['product_id']] = [
                'custom_price_usd' => $product['custom_price_usd'] ?? null,
            ];
        }

        $catalog->products()->syncWithoutDetaching($attachData);
    }

    /**
     * Detach product from catalog
     */
    public function detachProduct(Catalog $catalog, Product $product): void
    {
        $catalog->products()->detach($product->id);
    }

    /**
     * Update product price in catalog
     */
    public function updateProductPrice(Catalog $catalog, Product $product, ?int $price): void
    {
        $catalog->products()->updateExistingPivot($product->id, [
            'custom_price_usd' => $price,
        ]);
    }

    /**
     * Get catalog with products and formatted prices
     */
    public function getCatalogWithPrices(Catalog $catalog, CurrencyService $currencyService): array
    {
        $rate = $currencyService->getCurrentRate();

        $products = $catalog->products->map(function (Product $product) use ($rate) {
            $usdPrice = $product->pivot->custom_price_usd ?? $product->base_price_usd;
            $tomanPrice = $currencyService->convertToToman($usdPrice);

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price_usd' => $usdPrice / 100,
                'price_toman' => $tomanPrice / 100,
                'image' => $product->getFirstMedia('gallery')?->original_url,
            ];
        });

        return [
            'id' => $catalog->id,
            'name' => $catalog->name,
            'slug' => $catalog->slug,
            'description' => $catalog->description,
            'products' => $products,
        ];
    }
}
