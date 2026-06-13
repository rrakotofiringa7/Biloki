<?php

namespace Database\Factories;

use App\Models\Stock;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Stock>
 */
class StockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(0, 500);
        $reserved = $this->faker->numberBetween(0, $quantity);
        
        return [
            'product_id' => \App\Models\Product::factory(),
            'quantity' => $quantity,
            'reserved' => $reserved,
            'available' => $quantity - $reserved,
            'reorder_level' => $this->faker->numberBetween(5, 50),
            'reorder_quantity' => $this->faker->numberBetween(50, 500),
            'last_restocked_at' => $this->faker->dateTimeThisMonth(),
            'warehouse_location' => $this->faker->randomElement(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
        ];
    }
}
