<?php

namespace Database\Seeders;

use App\Models\Catalog;
use App\Models\Category;
use App\Models\CurrencyLog;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        // Create settings
        Setting::set('usd_rate', 160000);
        Setting::set('site_name', 'Admin Dashboard');
        Setting::set('site_description', 'Professional Admin Dashboard');

        // // Create categories
        // $categories = Category::factory(5)->create();

        // // Create products
        // foreach ($categories as $category) {
        //     Product::factory(8)
        //         ->for($category)
        //         ->create();
        // }

        // // Create catalogs
        // $catalogs = Catalog::factory(3)->create();

        // // Attach products to catalogs with custom prices
        // foreach ($catalogs as $catalog) {
        //     $products = Product::inRandomOrder()->limit(10)->get();

        //     foreach ($products as $product) {
        //         $catalog->products()->attach($product->id, [
        //             'custom_price_usd' => $this->getCustomPrice($product->base_price_usd),
        //         ]);
        //     }
        // }

        // // Create currency logs
        // CurrencyLog::factory(30)->create();
    }

    private function getCustomPrice(int $basePrice): int
    {
        // Add 5-20% markup for catalog price
        $markup = rand(5, 20);
        return (int) ($basePrice * (1 + $markup / 100));
    }
}
