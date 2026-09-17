<?php

namespace App\Http\Resources;

use App\Support\ProductPlaceholder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $images = $this->getMedia('gallery')->map(fn ($media) => [
            'id' => $media->id,
            'url' => $media->getUrl(),
            'order' => $media->order_column,
        ])->sortBy('order')->values();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null,
            'image' => $images->first()['url'] ?? ProductPlaceholder::url(),
            'images' => $images,
            'is_available' => $this->is_available,
            'href' => '/products/'.$this->slug,
        ];
    }
}
