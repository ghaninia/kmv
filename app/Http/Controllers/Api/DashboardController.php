<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Catalog;
use App\Models\Category;
use App\Models\Product;
use App\Services\CurrencyService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    protected CurrencyService $currencyService;

    public function __construct(CurrencyService $currencyService)
    {
        $this->currencyService = $currencyService;
    }

    /**
     * Get dashboard statistics
     */
    public function stats(): JsonResponse
    {
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $totalCatalogs = Catalog::count();
        $activeProducts = Product::where('status', true)->count();
        $activeCategories = Category::where('status', true)->count();
        $activeCatalogs = Catalog::where('status', true)->count();

        $rate = $this->currencyService->getCurrentRate();
        $formattedRate = $this->currencyService->getFormattedRate();

        return response()->json([
            'data' => [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'total_categories' => $totalCategories,
                'active_categories' => $activeCategories,
                'total_catalogs' => $totalCatalogs,
                'active_catalogs' => $activeCatalogs,
                'usd_rate' => $rate,
                'usd_rate_formatted' => $formattedRate . ' تومان',
            ],
        ]);
    }
}
