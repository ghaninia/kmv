<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\CatalogLink;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicCatalogTest extends TestCase
{
    use RefreshDatabase;
    protected Catalog $catalog;
    protected CatalogLink $link;

    protected function setUp(): void
    {
        parent::setUp();
        Setting::set('usd_rate', 85000000);

        $this->catalog = Catalog::factory()->create();
        $category = Category::factory()->create();
        $products = Product::factory(3)->for($category)->create();

        foreach ($products as $product) {
            $this->catalog->products()->attach($product->id, [
                'custom_price_usd' => $product->base_price_usd,
            ]);
        }

        $this->link = CatalogLink::factory()->for($this->catalog)->create();
    }

    public function test_public_can_access_catalog_via_short_link(): void
    {
        $response = $this->getJson("/api/catalog/{$this->link->short_code}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'slug',
                    'products' => [
                        '*' => ['id', 'name', 'price_usd', 'price_toman'],
                    ],
                ],
            ]);
    }

    public function test_public_catalog_includes_product_availability(): void
    {
        $product = $this->catalog->products()->first();
        $product->update(['is_available' => false]);

        $response = $this->getJson("/api/catalog/{$this->link->short_code}");

        $response->assertStatus(200)
            ->assertJsonPath('data.products.0.is_available', false);
    }

    public function test_public_cannot_access_invalid_short_code(): void
    {
        $response = $this->getJson('/api/catalog/invalid123');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Catalog not found',
            ]);
    }

    public function test_public_catalog_with_password_requires_password(): void
    {
        $link = CatalogLink::factory()
            ->for($this->catalog)
            ->withPassword('secret')
            ->create();

        $response = $this->getJson("/api/catalog/{$link->short_code}");

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'requires_password' => true,
            ]);
    }

    public function test_public_catalog_with_password_accepts_correct_password(): void
    {
        $password = 'secret123';
        $link = CatalogLink::factory()
            ->for($this->catalog)
            ->state([
                'password_hash' => hash('sha256', $password),
            ])
            ->create();

        $response = $this->getJson("/api/catalog/{$link->short_code}?password={$password}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_public_catalog_with_password_rejects_wrong_password(): void
    {
        $link = CatalogLink::factory()
            ->for($this->catalog)
            ->withPassword('correctpassword')
            ->create();

        $response = $this->getJson("/api/catalog/{$link->short_code}?password=wrongpassword");

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid password',
            ]);
    }

    public function test_public_cannot_access_expired_catalog_link(): void
    {
        $link = CatalogLink::factory()
            ->for($this->catalog)
            ->expired()
            ->create();

        $response = $this->getJson("/api/catalog/{$link->short_code}");

        $response->assertStatus(410)
            ->assertJson([
                'success' => false,
                'message' => 'This link has expired',
            ]);
    }
}
