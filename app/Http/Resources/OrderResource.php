<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'catalog_id' => $this->catalog_id,
            'catalog_name' => $this->whenLoaded('catalog', fn () => $this->catalog?->name),
            'customer_name' => $this->customer_name,
            'customer_phone' => $this->customer_phone,
            'customer_note' => $this->customer_note,
            'status' => $this->status,
            'status_label' => Order::statusLabels()[$this->status] ?? $this->status,
            'subtotal_usd' => $this->subtotal_usd / 100,
            'subtotal_toman' => $this->subtotal_toman / 100,
            'usd_to_toman_rate' => $this->usd_to_toman_rate / 100,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'items_count' => $this->when(isset($this->items_count), $this->items_count),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
