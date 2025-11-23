<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Laptop Dell XPS 13',
                'description' => 'High-performance laptop with Intel i7 processor',
                'price' => 1299.99,
                'stock' => 15,
            ],
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Latest Apple smartphone with A17 chip',
                'price' => 999.99,
                'stock' => 25,
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'description' => 'Premium Android smartphone',
                'price' => 899.99,
                'stock' => 0,
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Noise-canceling wireless headphones',
                'price' => 349.99,
                'stock' => 30,
            ],
            [
                'name' => 'iPad Air',
                'description' => 'Powerful tablet for work and play',
                'price' => 599.99,
                'stock' => 20,
            ],
            [
                'name' => 'MacBook Pro 14"',
                'description' => 'Professional laptop with M3 chip',
                'price' => 1999.99,
                'stock' => 10,
            ],
            [
                'name' => 'Apple Watch Series 9',
                'description' => 'Advanced smartwatch with health features',
                'price' => 429.99,
                'stock' => 18,
            ],
            [
                'name' => 'AirPods Pro 2',
                'description' => 'Premium wireless earbuds',
                'price' => 249.99,
                'stock' => 50,
            ],
            [
                'name' => 'Dell UltraSharp Monitor 27"',
                'description' => '4K USB-C monitor',
                'price' => 529.99,
                'stock' => 12,
            ],
            [
                'name' => 'Logitech MX Master 3S',
                'description' => 'Advanced wireless mouse',
                'price' => 99.99,
                'stock' => 35,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
