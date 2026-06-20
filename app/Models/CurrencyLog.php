<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CurrencyLog extends Model
{
    protected $fillable = [
        'currency',
        'rate',
        'source',
        'requested_at',
    ];

    protected $casts = [
        'rate' => 'integer',
        'requested_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public static function logRate(int $rate, ?string $source = null): self
    {
        return self::create([
            'currency' => 'USD_IRR',
            'rate' => $rate,
            'source' => $source,
            'requested_at' => now(),
        ]);
    }

    public static function getLatestRate(): ?int
    {
        return self::orderBy('created_at', 'desc')
            ->first()
            ?->rate;
    }
}
