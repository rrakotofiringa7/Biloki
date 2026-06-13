<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Client;
use App\Models\Stock;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@biloki.local',
            'password' => bcrypt('password'),
        ]);

        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create 15 products with stock
        Product::factory(15)->create()->each(function ($product) {
            Stock::factory()->create(['product_id' => $product->id]);
        });

        // Create 20 clients
        Client::factory(20)->create();
    }
}
