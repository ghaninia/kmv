<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => str($name)->slug(),
            'description' => $this->faker->paragraph(5),
            'base_price_usd' => $this->faker->numberBetween(1000, 100000), // in cents
            'status' => true,
        ];
    }

    public function inactive(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => false,
        ]);
    }

    public function expensive(): self
    {
        return $this->state(fn (array $attributes) => [
            'base_price_usd' => $this->faker->numberBetween(50000, 500000),
        ]);
    }

    public function cheap(): self
    {
        return $this->state(fn (array $attributes) => [
            'base_price_usd' => $this->faker->numberBetween(100, 5000),
        ]);
    }
}
