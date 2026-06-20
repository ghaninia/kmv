<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->category = Category::factory()->create();
        Storage::fake('public');
    }

    public function test_user_can_view_products_list(): void
    {
        Product::factory(5)->for($this->category)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'description', 'base_price_usd', 'status'],
                ],
                'pagination',
            ]);
    }

    public function test_user_can_create_product(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/products', [
                'category_id' => $this->category->id,
                'name' => 'Laptop',
                'description' => 'High-performance laptop',
                'base_price_usd' => 100000, // $1000 in cents
                'status' => true,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Product created successfully',
            ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Laptop',
            'slug' => 'laptop',
            'category_id' => $this->category->id,
        ]);
    }

    public function test_user_can_create_product_with_images(): void
    {
        $file = UploadedFile::fake()->image('product.jpg', 600, 600);

        $response = $this->actingAs($this->user)
            ->postJson('/api/products', [
                'category_id' => $this->category->id,
                'name' => 'Product with Image',
                'description' => 'Product description',
                'base_price_usd' => 50000,
                'status' => true,
                'images' => [$file],
            ]);

        $response->assertStatus(201);

        $product = Product::where('name', 'Product with Image')->first();
        $this->assertTrue($product->hasMedia('gallery'));
    }

    public function test_user_can_update_product(): void
    {
        $product = Product::factory()->for($this->category)->create([
            'name' => 'Old Name',
            'base_price_usd' => 50000,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/products/{$product->id}", [
                'category_id' => $this->category->id,
                'name' => 'New Name',
                'description' => 'Updated description',
                'base_price_usd' => 75000,
                'status' => false,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Product updated successfully',
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'New Name',
            'base_price_usd' => 75000,
        ]);
    }

    public function test_user_can_delete_product(): void
    {
        $product = Product::factory()->for($this->category)->create();

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Product deleted successfully',
            ]);

        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }

    public function test_user_can_filter_products_by_category(): void
    {
        $category1 = Category::factory()->create();
        $category2 = Category::factory()->create();

        Product::factory(3)->for($category1)->create();
        Product::factory(2)->for($category2)->create();

        $response = $this->actingAs($this->user)
            ->getJson("/api/products?category_id={$category1->id}");

        $response->assertStatus(200)
            ->assertJsonPath('pagination.count', 3);
    }

    public function test_user_can_search_products(): void
    {
        Product::factory()->for($this->category)->create(['name' => 'Laptop']);
        Product::factory()->for($this->category)->create(['name' => 'Keyboard']);

        $response = $this->actingAs($this->user)
            ->getJson('/api/products?search=Laptop');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.name', 'Laptop');
    }
}
