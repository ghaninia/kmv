<?php

namespace App\Http\Controllers;

use App\Models\CatalogLink;
use App\Services\CatalogLinkService;
use App\Services\CatalogService;
use App\Services\CurrencyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogPublicController extends Controller
{
    protected CatalogLinkService $catalogLinkService;
    protected CatalogService $catalogService;
    protected CurrencyService $currencyService;

    public function __construct(
        CatalogLinkService $catalogLinkService,
        CatalogService $catalogService,
        CurrencyService $currencyService
    ) {
        $this->catalogLinkService = $catalogLinkService;
        $this->catalogService = $catalogService;
        $this->currencyService = $currencyService;
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
}
