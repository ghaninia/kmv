<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CurrencyController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\CatalogPublicController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    // Public catalog endpoint
    Route::get('/catalog/{shortCode}', [CatalogPublicController::class, 'show'])->name('catalog.public');
    Route::post('/catalog/{shortCode}/orders', [CatalogPublicController::class, 'storeOrder'])->name('catalog.orders.store');
    Route::post('/catalog/{shortCode}/order-history', [CatalogPublicController::class, 'orderHistory'])->name('catalog.orders.history');
    Route::post('/catalog/{shortCode}/order-detail', [CatalogPublicController::class, 'showOrder'])->name('catalog.orders.show');

    // Authentication routes (public)
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected API routes
    Route::middleware('auth')->group(function () {
        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/user', [AuthController::class, 'user']);

        // Dashboard
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        // Categories
        Route::apiResource('categories', CategoryController::class);

        // Products
        Route::apiResource('products', ProductController::class);
        Route::post('products/{product}/delete-image', [ProductController::class, 'deleteImage']);
        Route::post('products/{product}/reorder-gallery', [ProductController::class, 'reorderGallery']);

        // Catalogs
        Route::apiResource('catalogs', CatalogController::class);
        Route::post('catalogs/{catalog}/clone', [CatalogController::class, 'clone']);
        Route::get('catalogs/{catalog}/products', [CatalogController::class, 'getProducts']);
        Route::get('catalogs/{catalog}/with-products', [CatalogController::class, 'showWithProducts']);
        Route::post('catalogs/{catalog}/attach-products', [CatalogController::class, 'attachProducts']);
        Route::delete('catalogs/{catalog}/products/{product}', [CatalogController::class, 'detachProduct']);
        Route::patch('catalogs/{catalog}/products/{product}/price', [CatalogController::class, 'updateProductPrice']);
        Route::post('catalogs/{catalog}/links', [CatalogController::class, 'createLink']);
        Route::get('catalogs/{catalog}/links', [CatalogController::class, 'getLinks']);
        Route::delete('catalogs/{catalog}/links', [CatalogController::class, 'deleteLink']);

        // Currency
        Route::get('/currency/rate', [CurrencyController::class, 'getRate']);
        Route::post('/currency/rate', [CurrencyController::class, 'updateRate']);
        Route::get('/currency/history', [CurrencyController::class, 'history']);

        // Orders / pre-invoices
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
        Route::get('/orders/{order}/invoice', [OrderController::class, 'invoice']);
    });
});
