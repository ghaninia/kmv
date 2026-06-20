<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

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
