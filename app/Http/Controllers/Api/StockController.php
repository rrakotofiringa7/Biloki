<?php

namespace App\Http\Controllers\Api;

use App\Models\Stock;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $query = Stock::with('product');

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->get('product_id'));
        }

        if ($request->filled('low_stock')) {
            $query->whereRaw('quantity <= reorder_level');
        }

        $sort_by = $request->get('sort_by', 'created_at');
        $sort_direction = $request->get('sort_direction', 'desc');
        $query->orderBy($sort_by, $sort_direction);

        return $query->paginate($request->get('per_page', 15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id|unique:stocks',
            'quantity' => 'required|integer|min:0',
            'reserved' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
            'reorder_quantity' => 'required|integer|min:1',
            'warehouse_location' => 'nullable|string',
        ]);

        return response()->json(Stock::create($validated), 201);
    }

    public function show(Stock $stock)
    {
        return $stock->load('product');
    }

    public function update(Request $request, Stock $stock)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
            'reserved' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
            'reorder_quantity' => 'required|integer|min:1',
            'warehouse_location' => 'nullable|string',
        ]);

        $stock->update($validated);
        return response()->json($stock);
    }

    public function destroy(Stock $stock)
    {
        $stock->delete();
        return response()->json(null, 204);
    }

    public function adjustStock(Request $request, Stock $stock)
    {
        $validated = $request->validate([
            'adjustment' => 'required|integer',
            'reason' => 'nullable|string',
        ]);

        $newQuantity = $stock->quantity + $validated['adjustment'];
        if ($newQuantity < 0) {
            return response()->json(['error' => 'Insufficient stock'], 422);
        }

        $stock->quantity = $newQuantity;
        $stock->last_restocked_at = now();
        $stock->save();

        return response()->json($stock);
    }
}
