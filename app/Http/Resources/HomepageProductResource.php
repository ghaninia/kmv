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
            'slug' => $this->slug,
            'image' => $image ?: ProductPlaceholder::url(),
            'href' => '/products/'.$this->slug,
        ];
    }
}
