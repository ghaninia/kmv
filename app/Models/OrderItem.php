<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'quantity',
        'unit_price_usd',
        'unit_price_toman',
        'line_total_usd',
        'line_total_toman',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price_usd' => 'integer',
        'unit_price_toman' => 'integer',
        'line_total_usd' => 'integer',
        'line_total_toman' => 'integer',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
