<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_user_can_view_catalogs_list(): void
    {
        Catalog::factory(5)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/catalogs');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'description', 'status', 'product_count'],
                ],
                'pagination',
            ]);
    }

    public function test_user_can_create_catalog(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/catalogs', [
                'name' => 'Summer Collection',
                'description' => 'Summer products',
                'status' => true,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Catalog created successfully',
            ]);

        $this->assertDatabaseHas('catalogs', [
            'name' => 'Summer Collection',
            'slug' => 'summer-collection',
        ]);
    }

    public function test_user_can_attach_products_to_catalog(): void
    {
        $catalog = Catalog::factory()->create();
        $products = Product::factory(3)->for(Category::factory())->create();

        $response = $this->actingAs($this->user)
            ->postJson("/api/catalogs/{$catalog->id}/attach-products", [
                'products' => [
                    [
                        'product_id' => $products[0]->id,
                        'custom_price_usd' => 50000,
                    ],
                    [
                        'product_id' => $products[1]->id,
                        'custom_price_usd' => null, // Use base price
                    ],
                ],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Products attached successfully',
            ]);

        $this->assertDatabaseHas('catalog_product', [
            'catalog_id' => $catalog->id,
            'product_id' => $products[0]->id,
            'custom_price_usd' => 50000,
        ]);
    }

    public function test_user_can_detach_product_from_catalog(): void
    {
        $catalog = Catalog::factory()->create();
        $product = Product::factory()->for(Category::factory())->create();
        $catalog->products()->attach($product->id, ['custom_price_usd' => 50000]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/catalogs/{$catalog->id}/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Product detached successfully',
            ]);

        $this->assertDatabaseMissing('catalog_product', [
            'catalog_id' => $catalog->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_user_can_update_product_price_in_catalog(): void
    {
        $catalog = Catalog::factory()->create();
        $product = Product::factory()->for(Category::factory())->create();
        $catalog->products()->attach($product->id, ['custom_price_usd' => 50000]);

        $response = $this->actingAs($this->user)
            ->patchJson("/api/catalogs/{$catalog->id}/products/{$product->id}/price", [
                'custom_price_usd' => 75000,
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('catalog_product', [
            'catalog_id' => $catalog->id,
            'product_id' => $product->id,
            'custom_price_usd' => 75000,
        ]);
    }

    public function test_user_can_delete_catalog(): void
    {
        $catalog = Catalog::factory()->create();

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/catalogs/{$catalog->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Catalog deleted successfully',
            ]);

        $this->assertSoftDeleted('catalogs', ['id' => $catalog->id]);
    }

    public function test_user_can_create_public_link_for_catalog(): void
    {
        $catalog = Catalog::factory()->create();

        $response = $this->actingAs($this->user)
            ->postJson("/api/catalogs/{$catalog->id}/links", [
                'password' => 'secret123',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Public link created successfully',
            ])
            ->assertJsonStructure([
                'data' => ['short_code', 'is_password_protected', 'public_url'],
            ]);

        $this->assertDatabaseHas('catalog_links', [
            'catalog_id' => $catalog->id,
        ]);
    }

    public function test_user_can_get_catalog_links(): void
    {
        $catalog = Catalog::factory()->create();
        $catalog->links()->create([
            'short_code' => 'abc123',
            'password_hash' => null,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/catalogs/{$catalog->id}/links");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'short_code', 'is_password_protected'],
                ],
            ]);
    }
}
