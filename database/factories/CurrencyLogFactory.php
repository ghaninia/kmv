<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CurrencyLog>
 */
class CurrencyLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'currency' => 'USD_IRR',
            'rate' => $this->faker->numberBetween(80000, 90000) * 100, // in cents
            'source' => $this->faker->randomElement(['API', 'Manual', 'CoinGecko']),
            'requested_at' => $this->faker->dateTimeBetweenStart('-30 days'),
        ];
    }
}
