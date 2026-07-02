<?php

namespace App\Services;

use App\Models\Catalog;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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
     * Clone a catalog along with all of its attached products (and their
     * custom prices). A unique name/slug is generated for the new catalog so
     * the database unique constraints are respected.
     */
    public function cloneCatalog(Catalog $catalog): Catalog
    {
        return DB::transaction(function () use ($catalog) {
            $newCatalog = Catalog::create([
                'name' => $this->generateUniqueName($catalog->name),
                'slug' => $this->generateUniqueSlug(),
                'description' => $catalog->description,
                'status' => $catalog->status,
            ]);

            $attachData = $catalog->products()
                ->get()
                ->mapWithKeys(fn (Product $product) => [
                    $product->id => [
                        'custom_price_usd' => $product->pivot->custom_price_usd,
                    ],
                ])
                ->all();

            if (!empty($attachData)) {
                $newCatalog->products()->attach($attachData);
            }

            return $newCatalog;
        });
    }

    /**
     * Build a unique catalog name based on the source name by appending a
     * "(کپی)" suffix, adding an incrementing counter when needed.
     */
    private function generateUniqueName(string $name): string
    {
        $base = $name . ' (کپی)';
        $candidate = $base;
        $counter = 2;

        while (Catalog::where('name', $candidate)->exists()) {
            $candidate = $base . ' ' . $counter;
            $counter++;
        }

        return $candidate;
    }

    /**
     * Generate a brand-new, unique catalog slug from scratch.
     */
    private function generateUniqueSlug(): string
    {
        do {
            $candidate = strtolower(Str::random(10));
        } while (Catalog::where('slug', $candidate)->exists());

        return $candidate;
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
                'is_available' => $product->is_available,
                'category_id' => $product->category_id,
                'category_name' => $category?->name,
                'price_usd' => $usdCents / 100,
                'price_toman' => $tomanCents / 100,
                'image' => $product->getFirstMedia('gallery')?->original_url,
                'images' => $product->getMedia('gallery')
                    ->map(fn ($media) => $media->original_url)
                    ->values()
                    ->all(),
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
