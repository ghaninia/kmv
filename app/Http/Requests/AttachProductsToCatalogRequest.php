<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttachProductsToCatalogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'products' => ['required', 'array'],
            'products.*.product_id' => ['required', 'exists:products,id'],
            'products.*.custom_price_usd' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
