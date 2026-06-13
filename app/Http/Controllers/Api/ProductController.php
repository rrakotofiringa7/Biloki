<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        $sort_by = $request->get('sort_by', 'created_at');
        $sort_direction = $request->get('sort_direction', 'desc');
        $query->orderBy($sort_by, $sort_direction);

        return $query->paginate($request->get('per_page', 15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:products',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sku' => 'required|string|unique:products',
            'image_url' => 'nullable|url',
            'status' => 'required|in:active,inactive',
        ]);

        $product = Product::create($validated);

        Stock::create([
            'product_id' => $product->id,
            'quantity' => 0,
            'reserved' => 0,
            'available' => 0,
            'reorder_level' => 10,
            'reorder_quantity' => 50,
        ]);

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product->load('stock');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:products,name,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'image_url' => 'nullable|url',
            'status' => 'required|in:active,inactive',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Product::whereIn('id', $ids)->delete();
        return response()->json(['message' => 'Products deleted'], 200);
    }
}

