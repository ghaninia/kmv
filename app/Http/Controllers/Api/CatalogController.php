<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttachProductsToCatalogRequest;
use App\Http\Requests\CreateCatalogLinkRequest;
use App\Http\Requests\StoreCatalogRequest;
use App\Http\Requests\UpdateCatalogRequest;
use App\Http\Resources\CatalogResource;
use App\Models\Catalog;
use App\Models\Product;
use App\Services\CatalogLinkService;
use App\Services\CatalogService;
use App\Services\CurrencyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    protected CatalogService $catalogService;
    protected CatalogLinkService $catalogLinkService;
    protected CurrencyService $currencyService;

    public function __construct(
        CatalogService $catalogService,
        CatalogLinkService $catalogLinkService,
        CurrencyService $currencyService
    ) {
        $this->catalogService = $catalogService;
        $this->catalogLinkService = $catalogLinkService;
        $this->currencyService = $currencyService;
    }

    /**
     * Get all catalogs
     */
    public function index(Request $request): JsonResponse
    {
        $query = Catalog::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->status !== null) {
            $query->where('status', (bool) $request->status);
        }

        $catalogs = $query->withCount('products')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'data' => CatalogResource::collection($catalogs),
            'pagination' => [
                'total' => $catalogs->total(),
                'count' => $catalogs->count(),
                'per_page' => $catalogs->perPage(),
                'current_page' => $catalogs->currentPage(),
                'last_page' => $catalogs->lastPage(),
            ],
        ]);
    }

    /**
     * Create catalog
     */
    public function store(StoreCatalogRequest $request): JsonResponse
    {
        $catalog = Catalog::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Catalog created successfully',
            'data' => new CatalogResource($catalog),
        ], 201);
    }

    /**
     * Get single catalog
     */
    public function show(Catalog $catalog): JsonResponse
    {
        $catalog->loadCount('products');

        return response()->json([
            'data' => new CatalogResource($catalog),
        ]);
    }

    /**
     * Get catalog with products
     */
    public function showWithProducts(Catalog $catalog): JsonResponse
    {
        $catalogData = $this->catalogService->getCatalogWithPrices(
            $catalog,
            $this->currencyService
        );

        return response()->json([
            'data' => $catalogData,
        ]);
    }

    /**
     * Update catalog
     */
    public function update(UpdateCatalogRequest $request, Catalog $catalog): JsonResponse
    {
        $catalog->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Catalog updated successfully',
            'data' => new CatalogResource($catalog),
        ]);
    }

    /**
     * Delete catalog
     */
    public function destroy(Catalog $catalog): JsonResponse
    {
        $catalog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catalog deleted successfully',
        ]);
    }

    /**
     * Clone catalog with all of its products
     */
    public function clone(Catalog $catalog): JsonResponse
    {
        $newCatalog = $this->catalogService->cloneCatalog($catalog);
        $newCatalog->loadCount('products');

        return response()->json([
            'success' => true,
            'message' => 'Catalog cloned successfully',
            'data' => new CatalogResource($newCatalog),
        ], 201);
    }

    /**
     * Get catalog products
     */
    public function getProducts(Catalog $catalog, Request $request): JsonResponse
    {
        $query = $catalog->products();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->paginate($request->per_page ?? 15);

        // Format with custom prices
        $products->getCollection()->transform(function (Product $product) {
            $customPrice = $product->pivot->custom_price_usd ?? $product->base_price_usd;

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'base_price_usd' => $product->base_price_usd / 100,
                'custom_price_usd' => $customPrice / 100,
                'price_usd' => $customPrice / 100,
                'status' => $product->status,
                'image' => $product->getFirstMedia('gallery')?->original_url,
            ];
        });

        return response()->json([
            'data' => $products->items(),
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
     * Attach products to catalog
     */
    public function attachProducts(
        AttachProductsToCatalogRequest $request,
        Catalog $catalog
    ): JsonResponse {
        $this->catalogService->attachProducts(
            $catalog,
            $request->input('products')
        );

        return response()->json([
            'success' => true,
            'message' => 'Products attached successfully',
        ]);
    }

    /**
     * Detach product from catalog
     */
    public function detachProduct(Catalog $catalog, Product $product): JsonResponse
    {
        $this->catalogService->detachProduct($catalog, $product);

        return response()->json([
            'success' => true,
            'message' => 'Product detached successfully',
        ]);
    }

    /**
     * Update product price in catalog
     */
    public function updateProductPrice(Catalog $catalog, Product $product, Request $request): JsonResponse
    {
        $request->validate([
            'custom_price_usd' => ['nullable', 'integer', 'min:0'],
        ]);

        $this->catalogService->updateProductPrice(
            $catalog,
            $product,
            $request->input('custom_price_usd')
        );

        return response()->json([
            'success' => true,
            'message' => 'Product price updated successfully',
        ]);
    }

    /**
     * Create public link for catalog
     */
    public function createLink(CreateCatalogLinkRequest $request, Catalog $catalog): JsonResponse
    {
        $link = $this->catalogLinkService->createLink(
            $catalog,
            $request->input('password'),
            $request->input('expires_at')
        );

        return response()->json([
            'success' => true,
            'message' => 'Public link created successfully',
            'data' => [
                'id' => $link->id,
                'short_code' => $link->short_code,
                'is_password_protected' => $link->isPasswordProtected(),
                'password' => $link->password_plain,
                'expires_at' => $link->expires_at,
                'public_url' => route('catalog.storefront', $link->short_code),
            ],
        ], 201);
    }

    /**
     * Get catalog links
     */
    public function getLinks(Catalog $catalog): JsonResponse
    {
        $links = $this->catalogLinkService->getCatalogLinks($catalog);

        return response()->json([
            'data' => $links->map(fn ($link) => [
                'id' => $link->id,
                'short_code' => $link->short_code,
                'is_password_protected' => $link->isPasswordProtected(),
                'password' => $link->password_plain,
                'is_expired' => $link->isExpired(),
                'expires_at' => $link->expires_at,
                'public_url' => route('catalog.storefront', $link->short_code),
                'created_at' => $link->created_at,
            ]),
        ]);
    }

    /**
     * Delete public link
     */
    public function deleteLink(Catalog $catalog, Request $request): JsonResponse
    {
        $linkId = $request->input('link_id');
        $link = $catalog->links()->find($linkId);

        if (!$link) {
            return response()->json([
                'success' => false,
                'message' => 'Link not found',
            ], 404);
        }

        $this->catalogLinkService->deleteLink($link);

        return response()->json([
            'success' => true,
            'message' => 'Link deleted successfully',
        ]);
    }
}
