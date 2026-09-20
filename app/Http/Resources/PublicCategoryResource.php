<?php

namespace App\Http\Resources;

use App\Support\StorefrontMedia;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $cover = $this->getFirstMedia('cover');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'products_count' => $this->products_count ?? $this->available_products_count ?? 0,
            'image' => StorefrontMedia::url($cover),
            'href' => '/categories/'.$this->slug,
        ];
    }
}
