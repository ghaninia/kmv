<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\CatalogLink;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Tests\TestCase;

class PublicCatalogTest extends TestCase
{
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

        $this->link = CatalogLink::create([
            'catalog_id' => $this->catalog->id,
            'short_code' => 'test123',
        ]);
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
        $link = CatalogLink::create([
            'catalog_id' => $this->catalog->id,
            'short_code' => 'protected123',
            'password_hash' => hash('sha256', 'secret'),
        ]);

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
        $link = CatalogLink::create([
            'catalog_id' => $this->catalog->id,
            'short_code' => 'protected456',
            'password_hash' => hash('sha256', $password),
        ]);

        $response = $this->getJson("/api/catalog/{$link->short_code}?password={$password}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_public_catalog_with_password_rejects_wrong_password(): void
    {
        $link = CatalogLink::create([
            'catalog_id' => $this->catalog->id,
            'short_code' => 'protected789',
            'password_hash' => hash('sha256', 'correctpassword'),
        ]);

        $response = $this->getJson("/api/catalog/{$link->short_code}?password=wrongpassword");

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid password',
            ]);
    }

    public function test_public_cannot_access_expired_catalog_link(): void
    {
        $link = CatalogLink::create([
            'catalog_id' => $this->catalog->id,
            'short_code' => 'expired123',
            'expires_at' => now()->subDay(),
        ]);

        $response = $this->getJson("/api/catalog/{$link->short_code}");

        $response->assertStatus(410)
            ->assertJson([
                'success' => false,
                'message' => 'This link has expired',
            ]);
    }
}
