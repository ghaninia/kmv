<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCatalogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:catalogs,name'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:catalogs,slug'],
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

        if ($this->status === null) {
            $this->merge(['status' => true]);
        }
    }
}
