<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CatalogLink extends Model
{
    protected $fillable = [
        'catalog_id',
        'short_code',
        'password_hash',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function catalog(): BelongsTo
    {
        return $this->belongsTo(Catalog::class);
    }

    public static function generateShortCode(): string
    {
        do {
            $code = Str::random(8);
        } while (self::where('short_code', $code)->exists());

        return $code;
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isPasswordProtected(): bool
    {
        return !is_null($this->password_hash);
    }

    public function verifyPassword(string $password): bool
    {
        return $this->isPasswordProtected() && hash_equals(
            $this->password_hash,
            hash('sha256', $password)
        );
    }
}
