<?php

namespace Database\Factories;

use App\Models\Catalog;
use App\Models\CatalogLink;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $catalog = Catalog::factory()->create();
        $link = CatalogLink::factory()->for($catalog)->create();

        return [
            'catalog_id' => $catalog->id,
            'catalog_link_id' => $link->id,
            'order_number' => 'PF-' . now()->format('Ymd') . '-' . $this->faker->unique()->numerify('####'),
            'customer_name' => $this->faker->name(),
            'customer_phone' => $this->faker->phoneNumber(),
            'customer_note' => $this->faker->optional()->sentence(),
            'status' => Order::STATUS_PENDING,
            'subtotal_usd' => 100000,
            'subtotal_toman' => 8500000000,
            'usd_to_toman_rate' => 85000000,
        ];
    }
}
