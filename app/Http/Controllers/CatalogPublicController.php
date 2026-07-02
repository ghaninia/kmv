<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCatalogOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\CatalogLink;
use App\Services\CatalogLinkService;
use App\Services\CatalogService;
use App\Services\CurrencyService;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogPublicController extends Controller
{
    protected CatalogLinkService $catalogLinkService;
    protected CatalogService $catalogService;
    protected CurrencyService $currencyService;
    protected OrderService $orderService;

    public function __construct(
        CatalogLinkService $catalogLinkService,
        CatalogService $catalogService,
        CurrencyService $currencyService,
        OrderService $orderService
    ) {
        $this->catalogLinkService = $catalogLinkService;
        $this->catalogService = $catalogService;
        $this->currencyService = $currencyService;
        $this->orderService = $orderService;
    }

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

        // Check password if protected
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

            if (!$password || !$this->catalogLinkService->verifyPassword($link, $password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid password',
                ], 403);
            }
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
}
