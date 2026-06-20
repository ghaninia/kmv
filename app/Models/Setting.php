<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    public $timestamps = true;

    protected static function booted(): void
    {
        static::addGlobalScope(function ($query) {
            $query->orderBy('key');
        });
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = self::where('key', $key)->first();

        if (!$setting) {
            return $default;
        }

        $value = $setting->value;

        // Try to decode JSON
        $decoded = json_decode($value, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }

        return $value;
    }

    public static function set(string $key, mixed $value): self
    {
        $value = is_array($value) || is_object($value) ? json_encode($value) : $value;

        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }

    public static function incrementValue(string $key, int $amount = 1): void
    {
        $current = (int) self::get($key, 0);
        self::set($key, $current + $amount);
    }
}
