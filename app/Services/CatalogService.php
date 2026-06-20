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
     * Get catalog with products and formatted prices.
     *
     * Builds a public-facing payload that the catalog storefront consumes:
     * a flat list of products (each tagged with its category) plus a grouped
     * list of categories with product counts. Prices are returned both in USD
     * and pre-converted to Toman, and the current USD→Toman rate is included so
     * the client can recompute if needed.
     */
    public function getCatalogWithPrices(Catalog $catalog, CurrencyService $currencyService): array
    {
        // Toman amount that one USD is worth (the rate is stored in cents).
        $tomanPerUsd = $currencyService->getCurrentRate() / 100;

        $catalog->loadMissing('products.category');

        $products = $catalog->products->map(function (Product $product) use ($currencyService) {
            $usdCents = $product->pivot->custom_price_usd ?? $product->base_price_usd;
            $tomanCents = $currencyService->convertToToman($usdCents);
            $category = $product->category;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'sku' => null,
                'stock' => null,
                'category_id' => $product->category_id,
                'category_name' => $category?->name,
                'price_usd' => $usdCents / 100,
                'price_toman' => $tomanCents / 100,
                'image' => $product->getFirstMedia('gallery')?->original_url,
            ];
        })->values();

        // Group products by category to expose ordered categories with counts.
        $categories = $catalog->products
            ->map(fn (Product $product) => $product->category)
            ->filter()
            ->unique('id')
            ->sortBy('name')
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'product_count' => $products->where('category_id', $category->id)->count(),
            ])
            ->values();

        return [
            'id' => $catalog->id,
            'name' => $catalog->name,
            'slug' => $catalog->slug,
            'description' => $catalog->description,
            'product_count' => $products->count(),
            'usd_to_toman_rate' => $tomanPerUsd,
            'categories' => $categories,
            'products' => $products,
        ];
    }
}
