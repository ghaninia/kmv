<?php

namespace Tests\Feature;

use App\Models\Catalog;
use App\Models\Category;
use App\Models\CurrencyLog;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CurrencyTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Setting::set('usd_rate', 85000000);
    }

    public function test_user_can_get_current_rate(): void
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/currency/rate');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['rate', 'rate_formatted', 'currency'],
            ]);
    }

    public function test_user_can_update_exchange_rate(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/currency/rate', [
                'rate' => 90000000,
                'source' => 'Manual',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Exchange rate updated successfully',
            ]);

        $this->assertEquals(90000000, Setting::get('usd_rate'));
    }

    public function test_user_can_get_currency_history(): void
    {
        CurrencyLog::factory(5)->create();

        $response = $this->actingAs($this->user)
            ->getJson('/api/currency/history');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['rate', 'rate_formatted', 'date'],
                ],
            ]);
    }

    public function test_currency_log_is_created_when_rate_is_updated(): void
    {
        $this->actingAs($this->user)
            ->postJson('/api/currency/rate', [
                'rate' => 92000000,
                'source' => 'API',
            ]);

        $this->assertDatabaseHas('currency_logs', [
            'rate' => 92000000,
            'source' => 'API',
        ]);
    }
}
