<?php

namespace App\Services;

use App\Models\Catalog;
use App\Models\Product;
use Illuminate\Http\UploadedFile;

class ProductService
{
    /**
     * Add images to product gallery
     */
    public function addImages(Product $product, array $images): void
    {
        foreach ($images as $image) {
            if ($image instanceof UploadedFile) {
                $product->addMedia($image)
                    ->toMediaCollection('gallery');
            }
        }
    }

    /**
     * Attach the product to every catalog using its base price.
     *
     * Existing catalog memberships are preserved; only catalogs the product is
     * not already part of receive it (with a null custom price so the base
     * price is used).
     */
    public function attachToAllCatalogs(Product $product): void
    {
        $attachData = Catalog::pluck('id')
            ->mapWithKeys(fn ($catalogId) => [$catalogId => ['custom_price_usd' => null]])
            ->all();

        if (!empty($attachData)) {
            $product->catalogs()->syncWithoutDetaching($attachData);
        }
    }

    /**
     * Delete image from product gallery
     */
    public function deleteImage(Product $product, int $mediaId): bool
    {
        $media = $product->media()->find($mediaId);

        if ($media) {
            $media->delete();
            return true;
        }

        return false;
    }

    /**
     * Reorder product gallery images
     */
    public function reorderImages(Product $product, array $mediaIds): void
    {
        foreach ($mediaIds as $order => $mediaId) {
            $product->media()
                ->where('id', $mediaId)
                ->where('collection_name', 'gallery')
                ->update(['order_column' => $order]);
        }
    }

    /**
     * Get product gallery
     */
    public function getGallery(Product $product)
    {
        return $product->getMedia('gallery')->sortBy('order_column');
    }

    /**
     * Delete all images for a product
     */
    public function deleteAllImages(Product $product): void
    {
        $product->clearMediaCollection('gallery');
    }
}
