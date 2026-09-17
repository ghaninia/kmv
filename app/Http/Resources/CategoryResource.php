<?php

namespace App\Http\Resources;

use App\Support\ProductPlaceholder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $cover = $this->getFirstMedia('cover');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'status' => $this->status,
            'product_count' => $this->products_count ?? $this->products()->count(),
            'image' => $cover?->getUrl() ?? ProductPlaceholder::url(),
            'cover_media' => $cover ? [
                'id' => $cover->id,
                'url' => $cover->getUrl(),
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
