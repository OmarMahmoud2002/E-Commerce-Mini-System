# Quick Start Guide

## Installation (5 minutes)

```bash
# 1. Install dependencies
composer install

# 2. Setup environment
cp .env.example .env
# Update DB credentials: admin / 123

# 3. Generate keys
php artisan key:generate
php artisan jwt:secret

# 4. Setup database
mysql -u admin -p123 -e "CREATE DATABASE IF NOT EXISTS ecommerce_task;"
php artisan migrate --seed

# 5. Start server
php artisan serve
```

## Test API

### 1. Login
```bash
POST http://localhost:8000/api/auth/login
{
  "email": "admin@example.com",
  "password": "123"
}
```

### 2. Get Products
```bash
GET http://localhost:8000/api/products
Authorization: Bearer {token}
```

### 3. Add to Cart
```bash
POST http://localhost:8000/api/cart/add
Authorization: Bearer {token}
{
  "product_id": 1,
  "quantity": 2
}
```

### 4. Create Order
```bash
POST http://localhost:8000/api/orders
Authorization: Bearer {token}
{
  "address": "123 Main St",
  "phone": "+1234567890"
}
```

## Import Postman Collection
Import `Postman_Collection.json` for complete API testing

## Database Seeded With
- 1 Admin user (admin@example.com / 123)
- 10 Sample products

## All Routes
```bash
php artisan route:list --path=api
```
