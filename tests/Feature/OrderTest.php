<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\CatalogLink;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Catalog $catalog;
    protected CatalogLink $link;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        Setting::set('usd_rate', 85000000);

        $this->user = User::factory()->create();
        $this->catalog = Catalog::factory()->create();
        $category = Category::factory()->create();
        $this->product = Product::factory()->for($category)->create([
            'base_price_usd' => 10000,
            'is_available' => true,
        ]);

        $this->catalog->products()->attach($this->product->id, [
            'custom_price_usd' => 10000,
        ]);

        $this->link = CatalogLink::factory()->for($this->catalog)->create();
    }

    public function test_public_can_submit_catalog_order(): void
    {
        $response = $this->postJson("/api/catalog/{$this->link->short_code}/orders", [
            'customer_name' => 'علی رضایی',
            'customer_phone' => '09120000000',
            'customer_note' => 'تحویل فوری',
            'items' => [
                ['product_id' => $this->product->id, 'quantity' => 2],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    'order_number',
                    'customer_name',
                    'subtotal_toman',
                    'items',
                ],
            ]);

        $this->assertDatabaseHas('orders', [
            'customer_name' => 'علی رضایی',
            'catalog_id' => $this->catalog->id,
        ]);

        $this->assertDatabaseHas('order_items', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);
    }

    public function test_public_cannot_order_unavailable_product(): void
    {
        $this->product->update(['is_available' => false]);

        $response = $this->postJson("/api/catalog/{$this->link->short_code}/orders", [
            'customer_name' => 'علی رضایی',
            'items' => [
                ['product_id' => $this->product->id, 'quantity' => 1],
            ],
        ]);

        $response->assertStatus(422);
    }

    public function test_admin_can_list_orders(): void
    {
        Order::factory()->create([
            'catalog_id' => $this->catalog->id,
            'catalog_link_id' => $this->link->id,
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/orders');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'order_number', 'customer_name', 'status', 'subtotal_toman'],
                ],
                'pagination',
            ]);
    }

    public function test_admin_can_view_order_invoice(): void
    {
        $order = Order::factory()->create([
            'catalog_id' => $this->catalog->id,
            'catalog_link_id' => $this->link->id,
        ]);

        $response = $this->actingAs($this->user)->get("/api/orders/{$order->id}/invoice");

        $response->assertStatus(200)
            ->assertSee($order->order_number)
            ->assertSee($order->customer_name);
    }

    public function test_admin_can_soft_delete_order(): void
    {
        $order = Order::factory()->create([
            'catalog_id' => $this->catalog->id,
            'catalog_link_id' => $this->link->id,
        ]);

        $response = $this->actingAs($this->user)->deleteJson("/api/orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertSoftDeleted('orders', [
            'id' => $order->id,
        ]);

        $this->actingAs($this->user)
            ->getJson("/api/orders/{$order->id}")
            ->assertStatus(404);
    }
}
