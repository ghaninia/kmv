<?php

namespace App\Http\Resources;

use App\Support\ProductPlaceholder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomepageProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $image = $this->getMedia('gallery')
            ->sortBy('order_column')
            ->first()
            ?->getUrl();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'category_name' => $this->category?->name,
            'category_slug' => $this->category?->slug,
            'slug' => $this->slug,
            'description' => $this->description ? trim($this->description) : null,
            'is_available' => $this->is_available,
            'images_count' => $this->getMedia('gallery')->count(),
            'image' => $image ?: ProductPlaceholder::url(),
            'href' => '/products/'.$this->slug,
        ];
    }
}
