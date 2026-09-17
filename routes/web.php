<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/products/{any?}', function () {
    return view('home');
})->where('any', '.*')->name('products');

Route::get('/categories/{any?}', function () {
    return view('home');
})->where('any', '.*')->name('categories');

Route::get('/about', function () {
    return view('home');
})->name('about');

Route::get('/contact', function () {
    return view('home');
})->name('contact');

Route::get('/faq', function () {
    return view('home');
})->name('faq');

// Public catalog storefront (React SPA). All /catalog/* paths resolve to the
// same view; client-side routing handles the :slug segment.
Route::get('/catalog/{any?}', function () {
    return view('catalog');
})->where('any', '.*')->name('catalog.storefront');

Route::get('/admin', function () {
    return view('admin');
});

Route::get('/admin/{any}', function () {
    return view('admin');
})->where('any', '.*');
