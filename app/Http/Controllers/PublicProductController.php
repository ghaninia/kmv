<?php

namespace App\Http\Controllers;

use App\Http\Resources\PublicProductResource;
use App\Models\Product;
use App\Support\StorefrontPagination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = $request->integer('page', 1);

        $query = Product::query()
            ->active()
            ->where('is_available', true)
            ->with(['category', 'media'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->trim();
                $query->where(function ($builder) use ($search) {
                    $builder->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->whereHas('category', fn ($category) => $category
                    ->where('slug', $request->string('category'))
                    ->where('status', true));
            })
            ->latest();

        $products = StorefrontPagination::paginate($query, $page);

        return response()->json([
            'success' => true,
            'data' => PublicProductResource::collection($products->items()),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::query()
            ->active()
            ->where('is_available', true)
            ->where('slug', $slug)
            ->with(['category', 'media'])
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $related = Product::query()
            ->active()
            ->where('is_available', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['category', 'media'])
            ->latest()
            ->limit(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'product' => new PublicProductResource($product),
                'related' => PublicProductResource::collection($related),
            ],
        ]);
    }
}
