<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = [
            'گوشی موبایل', 'لپ‌تاپ', 'تبلت', 'هدفون', 'ساعت هوشمند',
            'اسپیکر بلوتوثی', 'پاوربانک', 'ماوس', 'کیبورد', 'مانیتور',
            'دوربین عکاسی', 'کنسول بازی', 'شارژر', 'فلش مموری', 'هارد اکسترنال',
        ];

        $brands = [
            'سامسونگ', 'اپل', 'شیائومی', 'هوآوی', 'ال‌جی',
            'سونی', 'ایسوس', 'لنوو', 'اچ‌پی', 'دل',
        ];

        $type = $this->faker->randomElement($types);
        $brand = $this->faker->randomElement($brands);
        $model = $this->faker->bothify('?##', 'ABCDEFGHKLMNPRSTUVXYZ');

        $name = "{$type} {$brand} مدل {$model}";

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => 'mahsool-'.$this->faker->unique()->numerify('######'),
            'description' => $this->faker->randomElement([
                'محصولی با کیفیت بالا و طراحی مدرن که برای استفاده روزمره مناسب است.',
                'این محصول با بهره‌گیری از جدیدترین فناوری‌ها ساخته شده و عملکردی بی‌نظیر دارد.',
                'گزینه‌ای عالی برای کسانی که به دنبال کیفیت و دوام هستند.',
                'طراحی زیبا، کارایی بالا و قیمت مناسب از ویژگی‌های این محصول است.',
                'یکی از پرفروش‌ترین محصولات با رضایت بالای مشتریان.',
                'مناسب برای استفاده حرفه‌ای و خانگی با ضمانت اصالت کالا.',
            ]),
            'base_price_usd' => $this->faker->numberBetween(1000, 100000), // in cents
            'status' => true,
            'is_available' => true,
        ];
    }

    public function unavailable(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_available' => false,
        ]);
    }

    public function inactive(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => false,
        ]);
    }

    public function expensive(): self
    {
        return $this->state(fn (array $attributes) => [
            'base_price_usd' => $this->faker->numberBetween(50000, 500000),
        ]);
    }

    public function cheap(): self
    {
        return $this->state(fn (array $attributes) => [
            'base_price_usd' => $this->faker->numberBetween(100, 5000),
        ]);
    }
}
