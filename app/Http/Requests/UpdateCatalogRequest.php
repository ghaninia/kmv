<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCatalogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('catalogs', 'name')->ignore($this->catalog)],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('catalogs', 'slug')->ignore($this->catalog)],
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
