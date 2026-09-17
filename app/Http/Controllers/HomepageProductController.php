<?php

namespace App\Http\Controllers;

use App\Http\Resources\HomepageProductResource;
use App\Models\Product;
use App\Support\StorefrontPagination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomepageProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $limit = min(
            max($request->integer('limit', StorefrontPagination::homepageMaxItems()), 1),
            StorefrontPagination::homepageMaxItems(),
        );

        $products = Product::query()
            ->active()
            ->where('is_available', true)
            ->with(['category', 'media'])
            ->latest()
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => HomepageProductResource::collection($products),
        ]);
    }
}
