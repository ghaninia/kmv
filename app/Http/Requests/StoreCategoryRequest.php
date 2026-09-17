<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:categories,slug'],
            'description' => ['nullable', 'string'],
            'status' => ['boolean'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
        ];
    }

    public function prepareForValidation(): void
    {
        if (!$this->slug) {
            $this->merge([
                'slug' => (string) str($this->name)->slug(),
            ]);
        }
    }
}
