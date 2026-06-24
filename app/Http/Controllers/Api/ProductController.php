<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Get all products
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->status !== null) {
            $query->where('status', (bool) $request->status);
        }

        $products = $query->with('category')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'data' => ProductResource::collection($products),
            'pagination' => [
                'total' => $products->total(),
                'count' => $products->count(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ],
        ]);
    }

    /**
     * Create product
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        if ($request->hasFile('images')) {
            $this->productService->addImages($product, $request->file('images'));
        }

        if ($request->boolean('add_to_all_catalogs')) {
            $this->productService->attachToAllCatalogs($product);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => new ProductResource($product),
        ], 201);
    }

    /**
     * Get single product
     */
    public function show(Product $product): JsonResponse
    {
        $product->load('category');

        return response()->json([
            'data' => new ProductResource($product),
        ]);
    }

    /**
     * Update product
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());

        if ($request->hasFile('images')) {
            $this->productService->addImages($product, $request->file('images'));
        }

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => new ProductResource($product),
        ]);
    }

    /**
     * Delete product
     */
    public function destroy(Product $product): JsonResponse
    {
        // Delete all images
        $this->productService->deleteAllImages($product);
        
        // Delete product
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Delete image from product
     */
    public function deleteImage(Product $product, Request $request): JsonResponse
    {
        $mediaId = $request->input('media_id');

        if ($this->productService->deleteImage($product, $mediaId)) {
            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Image not found',
        ], 404);
    }

    /**
     * Reorder product gallery
     */
    public function reorderGallery(Product $product, Request $request): JsonResponse
    {
        $request->validate([
            'media_ids' => ['required', 'array'],
            'media_ids.*' => ['integer'],
        ]);

        $this->productService->reorderImages($product, $request->input('media_ids'));

        return response()->json([
            'success' => true,
            'message' => 'Gallery reordered successfully',
        ]);
    }
}
