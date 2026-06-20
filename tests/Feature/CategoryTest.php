<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_user_can_view_categories_list(): void
    {
        Category::factory(5)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'description', 'status', 'product_count'],
                ],
                'pagination',
            ]);
    }

    public function test_user_can_create_category(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/categories', [
                'name' => 'Electronics',
                'description' => 'Electronic products',
                'status' => true,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Category created successfully',
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Electronics',
            'slug' => 'electronics',
        ]);
    }

    public function test_user_can_update_category(): void
    {
        $category = Category::factory()->create([
            'name' => 'Old Name',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/categories/{$category->id}", [
                'name' => 'New Name',
                'description' => 'Updated description',
                'status' => false,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Category updated successfully',
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'New Name',
            'status' => false,
        ]);
    }

    public function test_user_cannot_delete_category_with_products(): void
    {
        $category = Category::factory()->has(Product::factory(2))->create();

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/categories/{$category->id}");

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Cannot delete category with products',
            ]);
    }

    public function test_user_can_delete_empty_category(): void
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/categories/{$category->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Category deleted successfully',
            ]);

        $this->assertSoftDeleted('categories', ['id' => $category->id]);
    }

    public function test_user_can_search_categories(): void
    {
        Category::factory()->create(['name' => 'Electronics']);
        Category::factory()->create(['name' => 'Books']);

        $response = $this->actingAs($this->user)
            ->getJson('/api/categories?search=Electronics');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.name', 'Electronics')
            ->assertJsonPath('pagination.count', 1);
    }
}
