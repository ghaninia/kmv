<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomepageCategoriesTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_categories_api_returns_active_categories_with_counts(): void
    {
        $active = Category::factory()->create([
            'name' => 'سمپاش',
            'slug' => 'sprayer',
            'status' => true,
        ]);

        Category::factory()->create([
            'name' => 'غیرفعال',
            'slug' => 'inactive',
            'status' => false,
        ]);

        Product::factory()->for($active)->create([
            'status' => true,
            'is_available' => true,
        ]);

        Product::factory()->for($active)->create([
            'status' => true,
            'is_available' => false,
        ]);

        $response = $this->getJson('/api/public/categories');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'sprayer')
            ->assertJsonPath('data.0.products_count', 1)
            ->assertJsonPath('data.0.href', '/categories/sprayer')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['image'],
                ],
            ]);
    }
}
