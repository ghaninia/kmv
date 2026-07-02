<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $images = $this->getMedia('gallery')->map(fn ($media) => [
            'id' => $media->id,
            'url' => $media->original_url,
            'order' => $media->order_column,
        ])->sortBy('order');

        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category_name' => $this->category?->name,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'base_price_usd' => $this->base_price_usd / 100,
            'status' => $this->status,
            'is_available' => $this->is_available,
            'image' => $images->first()['url'] ?? null,
            'images' => $images->values(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
