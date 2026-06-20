<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->randomElement([
            'موبایل و تبلت',
            'لپ‌تاپ و کامپیوتر',
            'صوتی و تصویری',
            'لوازم جانبی',
            'کنسول و بازی',
            'دوربین و عکاسی',
            'لوازم خانگی',
            'پوشاک و مد',
            'کتاب و لوازم‌التحریر',
            'ورزش و سفر',
        ]);

        return [
            'name' => $name,
            'slug' => 'category-'.$this->faker->unique()->numerify('######'),
            'description' => $this->faker->randomElement([
                'مجموعه‌ای متنوع از بهترین محصولات این دسته با قیمت مناسب.',
                'جدیدترین و باکیفیت‌ترین کالاهای موجود در این دسته‌بندی.',
                'گزیده‌ای از پرفروش‌ترین محصولات با ضمانت اصالت کالا.',
                'انتخابی گسترده برای تمام سلیقه‌ها و بودجه‌ها.',
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
