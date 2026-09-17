<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomepageProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_fetch_homepage_products(): void
    {
        $category = Category::factory()->create([
            'name' => 'پمپ و گیربکس',
        ]);

        Product::factory()->for($category)->create([
            'name' => 'پمپ سمپاش',
            'slug' => 'pump-sprayer',
            'status' => true,
            'is_available' => true,
        ]);

        Product::factory()->for($category)->create([
            'status' => false,
            'is_available' => true,
        ]);

        Product::factory()->for($category)->create([
            'status' => true,
            'is_available' => false,
        ]);

        $response = $this->getJson('/api/homepage/products');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonCount(1, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'category_name', 'slug', 'image', 'href'],
                ],
            ])
            ->assertJsonPath('data.0.name', 'پمپ سمپاش')
            ->assertJsonPath('data.0.category_name', 'پمپ و گیربکس')
            ->assertJsonPath('data.0.href', '/products/pump-sprayer');
    }
}
