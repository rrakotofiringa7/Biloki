<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->sentence(10),
            'price' => $this->faker->numberBetween(2999, 99999) / 100,
            'sku' => 'SKU-' . strtoupper($this->faker->unique()->bothify('??-####')),
            'image_url' => 'https://via.placeholder.com/300?text=Product',
            'status' => $this->faker->randomElement(['active', 'inactive']),
        ];
    }
}
