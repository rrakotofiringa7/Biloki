<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    use HasFactory;
    protected $fillable = [
        'product_id',
        'quantity',
        'reserved',
        'available',
        'reorder_level',
        'reorder_quantity',
        'last_restocked_at',
        'warehouse_location',
    ];

    protected $casts = [
        'last_restocked_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected static function boot()
    {
        parent::boot();
        static::saving(function ($stock) {
            $stock->available = $stock->quantity - $stock->reserved;
        });
    }
}
