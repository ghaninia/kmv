<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'quantity' => $this->quantity,
            'unit_price_usd' => $this->unit_price_usd / 100,
            'unit_price_toman' => $this->unit_price_toman / 100,
            'line_total_usd' => $this->line_total_usd / 100,
            'line_total_toman' => $this->line_total_toman / 100,
        ];
    }
}
