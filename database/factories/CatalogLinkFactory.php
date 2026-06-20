<?php

namespace Database\Factories;

use App\Models\Catalog;
use App\Models\CatalogLink;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CatalogLink>
 */
class CatalogLinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'catalog_id' => Catalog::factory(),
            'short_code' => CatalogLink::generateShortCode(),
            'password_hash' => null,
            'expires_at' => null,
        ];
    }

    public function withPassword(string $password = 'password'): static
    {
        return $this->state(function (array $attributes) use ($password) {
            return [
                'password_hash' => hash('sha256', $password),
            ];
        });
    }

    public function expired(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'expires_at' => now()->subDay(),
            ];
        });
    }
}
