<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255', 'unique:products,name'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'base_price_usd' => ['required', 'integer', 'min:0'],
            'status' => ['boolean'],
            'is_available' => ['boolean'],
            'add_to_all_catalogs' => ['boolean'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif', 'max:5120'], // 5MB max
        ];
    }

    public function prepareForValidation(): void
    {
        if (!$this->slug) {
            $this->merge([
                'slug' => (string) str($this->name)->slug(),
            ]);
        }

        if ($this->status === null) {
            $this->merge(['status' => true]);
        }

        if ($this->is_available === null) {
            $this->merge(['is_available' => true]);
        }
    }
}
