<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'base_price_usd',
        'status',
    ];

    protected $casts = [
        'base_price_usd' => 'integer',
        'status' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function catalogs(): BelongsToMany
    {
        return $this->belongsToMany(Catalog::class, 'catalog_product')
            ->withPivot('custom_price_usd')
            ->withTimestamps();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('gallery')
            ->useFallbackUrl('storage/placeholders/product.jpg')
            ->useFallbackPath(public_path('storage/placeholders/product.jpg'));
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public function getPriceInToman(int $rate): int
    {
        return $this->base_price_usd * $rate;
    }
}
