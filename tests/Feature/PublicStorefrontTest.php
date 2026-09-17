<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicStorefrontTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_list_categories_with_product_counts(): void
    {
        $category = Category::factory()->create([
            'name' => 'پمپ و گیربکس',
            'slug' => 'pump-gearbox',
            'status' => true,
        ]);

        Product::factory()->for($category)->create([
            'status' => true,
            'is_available' => true,
        ]);

        Product::factory()->for($category)->inactive()->create();

        $response = $this->getJson('/api/public/categories');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'pump-gearbox')
            ->assertJsonPath('data.0.products_count', 1)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'image', 'href', 'products_count'],
                ],
            ]);
    }

    public function test_public_categories_are_ordered_by_product_count_desc(): void
    {
        $few = Category::factory()->create([
            'name' => 'کم محصول',
            'slug' => 'few-products',
            'status' => true,
        ]);

        $many = Category::factory()->create([
            'name' => 'پر محصول',
            'slug' => 'many-products',
            'status' => true,
        ]);

        Product::factory()->for($few)->count(1)->create([
            'status' => true,
            'is_available' => true,
        ]);

        Product::factory()->for($many)->count(3)->create([
            'status' => true,
            'is_available' => true,
        ]);

        $response = $this->getJson('/api/public/categories');

        $response->assertOk()
            ->assertJsonPath('data.0.slug', 'many-products')
            ->assertJsonPath('data.0.products_count', 3)
            ->assertJsonPath('data.1.slug', 'few-products')
            ->assertJsonPath('data.1.products_count', 1);
    }

    public function test_public_products_list_paginates_twelve_per_page(): void
    {
        $category = Category::factory()->create(['status' => true]);

        Product::factory()->for($category)->count(30)->create([
            'status' => true,
            'is_available' => true,
        ]);

        $response = $this->getJson('/api/public/products?page=1');

        $response->assertOk()
            ->assertJsonPath('meta.per_page', 12)
            ->assertJsonPath('meta.last_page', 3)
            ->assertJsonPath('meta.total', 30)
            ->assertJsonCount(12, 'data');

        $pageTwo = $this->getJson('/api/public/products?page=2');

        $pageTwo->assertOk()
            ->assertJsonCount(12, 'data');

        $this->getJson('/api/public/products?page=3')
            ->assertOk()
            ->assertJsonCount(6, 'data');
    }

    public function test_public_can_list_products(): void
    {
        $category = Category::factory()->create(['status' => true]);

        Product::factory()->for($category)->create([
            'name' => 'فیلتر روغن',
            'slug' => 'oil-filter',
            'status' => true,
            'is_available' => true,
        ]);

        $response = $this->getJson('/api/public/products');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'oil-filter')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'image', 'href', 'category'],
                ],
                'meta' => ['current_page', 'last_page', 'total'],
            ]);
    }

    public function test_public_can_view_product_by_slug(): void
    {
        $category = Category::factory()->create([
            'name' => 'اتصالات',
            'slug' => 'fittings',
            'status' => true,
        ]);

        $product = Product::factory()->for($category)->create([
            'name' => 'شیر سه راهی',
            'slug' => 'three-way-valve',
            'status' => true,
            'is_available' => true,
        ]);

        Product::factory()->for($category)->create([
            'name' => 'محصول مرتبط',
            'status' => true,
            'is_available' => true,
        ]);

        $response = $this->getJson('/api/public/products/three-way-valve');

        $response->assertOk()
            ->assertJsonPath('data.product.slug', 'three-way-valve')
            ->assertJsonPath('data.product.category.slug', 'fittings')
            ->assertJsonCount(1, 'data.related');
    }

    public function test_public_can_view_category_with_products(): void
    {
        $category = Category::factory()->create([
            'name' => 'مخزن سمپاش',
            'slug' => 'sprayer-tank',
            'status' => true,
        ]);

        Product::factory()->for($category)->count(2)->create([
            'status' => true,
            'is_available' => true,
        ]);

        $response = $this->getJson('/api/public/categories/sprayer-tank');

        $response->assertOk()
            ->assertJsonPath('data.category.slug', 'sprayer-tank')
            ->assertJsonCount(2, 'data.products');
    }
}
