<?php

namespace App\Http\Controllers;

use App\Http\Requests\LookupCatalogOrdersRequest;
use App\Http\Requests\ShowCatalogOrderRequest;
use App\Http\Requests\StoreCatalogOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\CatalogLink;
use App\Models\Order;
use App\Services\CatalogLinkService;
use App\Services\CatalogService;
use App\Services\CurrencyService;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogPublicController extends Controller
{
    public function __construct(
        protected CatalogLinkService $catalogLinkService,
        protected CatalogService $catalogService,
        protected CurrencyService $currencyService,
        protected OrderService $orderService,
    ) {}

    /**
     * Get catalog by short code
     */
    public function show(string $shortCode, Request $request): JsonResponse
    {
        $link = $this->catalogLinkService->getCatalogByShortCode($shortCode);

        if (!$link) {
            return response()->json([
                'success' => false,
                'message' => 'Catalog not found',
            ], 404);
        }

        if ($link->isExpired()) {
            return response()->json([
                'success' => false,
                'message' => 'This link has expired',
            ], 410);
        }

        if ($link->isPasswordProtected()) {
            $password = $request->input('password');

            if (!$password) {
                return response()->json([
                    'success' => false,
                    'message' => 'This catalog is password protected',
                    'requires_password' => true,
                ], 403);
            }

            if (!$this->catalogLinkService->verifyPassword($link, $password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid password',
                ], 403);
            }
        }

        $catalog = $link->catalog;
        $catalogData = $this->catalogService->getCatalogWithPrices(
            $catalog,
            $this->currencyService
        );

        $catalogData['has_password'] = $link->isPasswordProtected();

        return response()->json([
            'success' => true,
            'data' => $catalogData,
        ]);
    }

    /**
     * Submit a pre-invoice order from the public catalog.
     */
    public function storeOrder(string $shortCode, StoreCatalogOrderRequest $request): JsonResponse
    {
        $link = $this->resolveAccessibleLink($shortCode, $request->input('password'));

        if ($link instanceof JsonResponse) {
            return $link;
        }

        $order = $this->orderService->createFromCatalogLink(
            $link,
            $request->input('customer_name'),
            $request->input('customer_phone'),
            $request->input('customer_note'),
            $request->input('items'),
        );

        return response()->json([
            'success' => true,
            'message' => 'پیش‌فاکتور با موفقیت ثبت شد',
            'data' => new OrderResource($order),
        ], 201);
    }

    /**
     * List orders submitted through this catalog link.
     */
    public function orderHistory(string $shortCode, LookupCatalogOrdersRequest $request): JsonResponse
    {
        $link = $this->resolveAccessibleLink($shortCode, $request->input('password'));

        if ($link instanceof JsonResponse) {
            return $link;
        }

        $orders = Order::query()
            ->where('catalog_link_id', $link->id)
            ->withCount('items')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => OrderResource::collection($orders),
        ]);
    }

    /**
     * Show a single order previously submitted from this catalog link.
     */
    public function showOrder(string $shortCode, ShowCatalogOrderRequest $request): JsonResponse
    {
        $link = $this->resolveAccessibleLink($shortCode, $request->input('password'));

        if ($link instanceof JsonResponse) {
            return $link;
        }

        $order = Order::query()
            ->where('catalog_link_id', $link->id)
            ->whereKey($request->validated('order_id'))
            ->with(['items', 'catalog'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'سفارش پیدا نشد',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new OrderResource($order),
        ]);
    }

    protected function resolveAccessibleLink(string $shortCode, ?string $password): CatalogLink|JsonResponse
    {
        $link = $this->catalogLinkService->getCatalogByShortCode($shortCode);

        if (!$link) {
            return response()->json([
                'success' => false,
                'message' => 'Catalog not found',
            ], 404);
        }

        if ($link->isExpired()) {
            return response()->json([
                'success' => false,
                'message' => 'This link has expired',
            ], 410);
        }

        if ($link->isPasswordProtected()) {
            if (!$password || !$this->catalogLinkService->verifyPassword($link, $password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid password',
                ], 403);
            }
        }

        return $link;
    }
}
