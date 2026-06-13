<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\StockController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Products
    Route::apiResource('products', ProductController::class);
    Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete']);

    // Clients
    Route::apiResource('clients', ClientController::class);
    Route::post('/clients/bulk-delete', [ClientController::class, 'bulkDelete']);

    // Stock
    Route::apiResource('stocks', StockController::class);
    Route::post('/stocks/{stock}/adjust', [StockController::class, 'adjustStock']);
});
