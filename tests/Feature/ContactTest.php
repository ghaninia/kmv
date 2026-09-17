<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_form_can_be_submitted(): void
    {
        Log::spy();

        $response = $this->postJson('/api/contact', [
            'name' => 'علی رضایی',
            'email' => 'ali@example.com',
            'phone' => '09120000000',
            'subject' => 'سفارش محصول',
            'message' => 'سلام، برای خرید محصول نیاز به مشاوره دارم.',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true);

        Log::shouldHaveReceived('info')
            ->once()
            ->with('Contact form submission', \Mockery::subset([
                'name' => 'علی رضایی',
                'email' => 'ali@example.com',
            ]));
    }

    public function test_contact_form_requires_valid_fields(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => '',
            'email' => 'not-an-email',
            'message' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'message']);
    }
}
