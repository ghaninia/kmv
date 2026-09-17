<?php

namespace App\Http\Controllers;

use App\Http\Resources\PublicCategoryResource;
use App\Http\Resources\PublicProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Support\StorefrontPagination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->active()
            ->withCount(['products as available_products_count' => function ($query) {
                $query->where('status', true)->where('is_available', true);
            }])
            ->orderByDesc('available_products_count')
            ->orderBy('name')
            ->get()
            ->filter(fn (Category $category) => $category->available_products_count > 0)
            ->values();

        return response()->json([
            'success' => true,
            'data' => PublicCategoryResource::collection($categories),
        ]);
    }

    public function show(string $slug, Request $request): JsonResponse
    {
        $category = Category::query()
            ->active()
            ->where('slug', $slug)
            ->withCount(['products as available_products_count' => function ($query) {
                $query->where('status', true)->where('is_available', true);
            }])
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $page = $request->integer('page', 1);

        $query = Product::query()
            ->active()
            ->where('is_available', true)
            ->where('category_id', $category->id)
            ->with(['category', 'media'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();
                $query->where(function ($builder) use ($search) {
                    $builder->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest();

        $products = StorefrontPagination::paginate($query, $page);

        return response()->json([
            'success' => true,
            'data' => [
                'category' => new PublicCategoryResource($category),
                'products' => PublicProductResource::collection($products->items()),
            ],
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }
}
