<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($this->category)],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($this->category)],
            'description' => ['nullable', 'string'],
            'status' => ['boolean'],
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
