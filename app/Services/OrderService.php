<?php

namespace App\Services;

use App\Models\CatalogLink;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        protected CatalogLinkService $catalogLinkService,
        protected CurrencyService $currencyService,
    ) {}

    /**
     * Create an order from a public catalog link submission.
     *
     * @param  array<int, array{product_id: int, quantity: int}>  $items
     */
    public function createFromCatalogLink(
        CatalogLink $link,
        string $customerName,
        ?string $customerPhone,
        ?string $customerNote,
        array $items,
    ): Order {
        $catalog = $link->catalog()->with(['products' => fn ($query) => $query->where('status', true)])->firstOrFail();
        $rate = $this->currencyService->getCurrentRate();

        $catalogProducts = $catalog->products->keyBy('id');
        $orderItems = [];
        $subtotalUsd = 0;
        $subtotalToman = 0;

        foreach ($items as $item) {
            $productId = (int) $item['product_id'];
            $quantity = (int) $item['quantity'];

            /** @var Product|null $product */
            $product = $catalogProducts->get($productId);

            if (!$product) {
                throw ValidationException::withMessages([
                    'items' => ['یکی از محصولات انتخاب‌شده در این کاتالوگ موجود نیست.'],
                ]);
            }

            if (!$product->is_available) {
                throw ValidationException::withMessages([
                    'items' => ["محصول «{$product->name}» موجود نیست و قابل ثبت سفارش نیست."],
                ]);
            }

            $unitUsd = (int) ($product->pivot->custom_price_usd ?? $product->base_price_usd);
            $unitToman = $this->currencyService->convertToToman($unitUsd);
            $lineUsd = $unitUsd * $quantity;
            $lineToman = $unitToman * $quantity;

            $subtotalUsd += $lineUsd;
            $subtotalToman += $lineToman;

            $orderItems[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'quantity' => $quantity,
                'unit_price_usd' => $unitUsd,
                'unit_price_toman' => $unitToman,
                'line_total_usd' => $lineUsd,
                'line_total_toman' => $lineToman,
            ];
        }

        return DB::transaction(function () use (
            $link,
            $catalog,
            $customerName,
            $customerPhone,
            $customerNote,
            $rate,
            $subtotalUsd,
            $subtotalToman,
            $orderItems,
        ) {
            $order = Order::create([
                'catalog_id' => $catalog->id,
                'catalog_link_id' => $link->id,
                'order_number' => $this->generateOrderNumber(),
                'customer_name' => $customerName,
                'customer_phone' => $customerPhone,
                'customer_note' => $customerNote,
                'status' => Order::STATUS_PENDING,
                'subtotal_usd' => $subtotalUsd,
                'subtotal_toman' => $subtotalToman,
                'usd_to_toman_rate' => $rate,
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            return $order->load(['items', 'catalog']);
        });
    }

    protected function generateOrderNumber(): string
    {
        $prefix = 'PF-' . now()->format('Ymd');

        do {
            $number = $prefix . '-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}
