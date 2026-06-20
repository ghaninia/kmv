<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Catalog>
 */
class CatalogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->randomElement([
            'کاتالوگ فروش ویژه بهاره',
            'کاتالوگ عمده‌فروشی',
            'کاتالوگ محصولات دیجیتال',
            'کاتالوگ تخفیف‌های فصلی',
            'کاتالوگ لوازم خانگی',
            'کاتالوگ همکاران فروش',
            'کاتالوگ محصولات جدید',
            'کاتالوگ فروشگاه مرکزی',
        ]);

        return [
            'name' => $name,
            'slug' => 'catalog-'.$this->faker->unique()->numerify('######'),
            'description' => $this->faker->randomElement([
                'فهرست کاملی از محصولات منتخب با قیمت‌های ویژه برای مشتریان.',
                'کاتالوگ اختصاصی شامل بهترین محصولات با شرایط فروش مناسب.',
                'مجموعه‌ای از کالاهای پرفروش با امکان سفارش آنلاین.',
                'لیست محصولات به‌روز با قیمت‌گذاری رقابتی.',
            ]),
            'status' => true,
        ];
    }

    public function inactive(): self
    {
        return $this->state(fn (array $attributes) => [
            'status' => false,
        ]);
    }
}
