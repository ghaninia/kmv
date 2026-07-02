<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_CONFIRMED = 'confirmed';

    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'catalog_id',
        'catalog_link_id',
        'order_number',
        'customer_name',
        'customer_phone',
        'customer_note',
        'status',
        'subtotal_usd',
        'subtotal_toman',
        'usd_to_toman_rate',
    ];

    protected $casts = [
        'subtotal_usd' => 'integer',
        'subtotal_toman' => 'integer',
        'usd_to_toman_rate' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function catalog(): BelongsTo
    {
        return $this->belongsTo(Catalog::class);
    }

    public function catalogLink(): BelongsTo
    {
        return $this->belongsTo(CatalogLink::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function statusLabels(): array
    {
        return [
            self::STATUS_PENDING => 'در انتظار',
            self::STATUS_CONFIRMED => 'تایید شده',
            self::STATUS_CANCELLED => 'لغو شده',
        ];
    }
}
