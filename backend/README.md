# E-Commerce Backend API

Laravel-based REST API for e-commerce system with JWT authentication.

## 🚀 Quick Start

### Requirements

- PHP 8.1+
- MySQL 8.0+
- Composer
- Postman (for testing)

### Installation Steps

1. **Clone and Navigate**
```bash
git clone <repository-url>
cd backend
```

2. **Install Dependencies**
```bash
composer install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Update `.env` with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_task
DB_USERNAME=admin
DB_PASSWORD=123
```

4. **Generate Keys**
```bash
php artisan key:generate
php artisan jwt:secret
```

5. **Database Setup**
```bash
# Create database
mysql -u admin -p123 -e "CREATE DATABASE IF NOT EXISTS ecommerce_task;"

# Run migrations and seeders
php artisan migrate --seed
```

6. **Start Server**
```bash
php artisan serve
```

API will be available at: `http://localhost:8000`

---

## 🔐 Default Credentials

Use these credentials to login:
- **Email**: `admin@example.com`
- **Password**: `123`

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Required
All endpoints except `/auth/register` and `/auth/login` require JWT token in header:
```
Authorization: Bearer {your-token}
```

---

## 📋 API Endpoints

### 1️⃣ Authentication

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201)**:
```json
{
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-11-23T18:30:00.000000Z",
    "updated_at": "2025-11-23T18:30:00.000000Z"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "123"
}
```

**Response (200)**:
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**💡 Save the token for subsequent requests!**

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

---

### 2️⃣ Products

#### List All Products
```http
GET /api/products?page=1&search=laptop&status=in_stock
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (optional): Page number for pagination
- `search` (optional): Search by product name
- `status` (optional): Filter by status (in_stock, out_of_stock)

**Response (200)**:
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "Laptop Dell XPS 13",
      "description": "High-performance laptop",
      "price": "1299.99",
      "stock": 15,
      "status": "in_stock",
      "created_at": "2025-11-23T18:19:17.000000Z",
      "updated_at": "2025-11-23T18:19:17.000000Z"
    }
  ],
  "per_page": 15,
  "total": 10
}
```

#### Get Single Product
```http
GET /api/products/{id}
Authorization: Bearer {token}
```

#### Create Product
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 10
}
```

**Validation Rules**:
- `name`: required, string, max 255 characters
- `description`: optional, string
- `price`: required, numeric, minimum 0
- `stock`: required, integer, minimum 0

**Response (201)**: Returns created product

#### Update Product
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 89.99,
  "stock": 15
}
```

**Response (200)**: Returns updated product

#### Delete Product
```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "message": "Product deleted successfully"
}
```

---

### 3️⃣ Shopping Cart

#### Get Cart Items
```http
GET /api/cart
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "items": [
    {
      "id": 1,
      "user_id": 1,
      "product_id": 1,
      "quantity": 2,
      "product": {
        "id": 1,
        "name": "Laptop Dell XPS 13",
        "price": "1299.99",
        "stock": 15
      }
    }
  ],
  "total": "2599.98"
}
```

#### Add Product to Cart
```http
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

**Validation Rules**:
- `product_id`: required, must exist in products table
- `quantity`: required, integer, minimum 1

**⚠️ Note**: If product already in cart, quantity will be updated

**Response (201)**: Returns cart item with product details

#### Update Cart Item Quantity
```http
PUT /api/cart/{cartItemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

**Response (200)**: Returns updated cart item

#### Remove Item from Cart
```http
DELETE /api/cart/{cartItemId}
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "message": "Item removed from cart"
}
```

#### Clear Entire Cart
```http
DELETE /api/cart/clear
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "message": "Cart cleared"
}
```

---

### 4️⃣ Orders

#### List User Orders
```http
GET /api/orders?page=1
Authorization: Bearer {token}
```

**Response (200)**:
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "order_number": "ORD-6564F2A1B9E8C",
      "total": "2599.98",
      "address": "123 Main St, City, Country",
      "phone": "+1234567890",
      "status": "pending",
      "created_at": "2025-11-23T19:00:00.000000Z",
      "items": [...]
    }
  ],
  "per_page": 15,
  "total": 1
}
```

#### Create New Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "address": "123 Main Street, City, Country",
  "phone": "+1234567890"
}
```

**Validation Rules**:
- `address`: required, string
- `phone`: required, string

**Business Logic**:
1. Validates cart is not empty
2. Checks stock availability for all items
3. Creates order in database transaction
4. Decrements product stock
5. Clears user's cart

**Response (201)**:
```json
{
  "order_number": "ORD-6564F2A1B9E8C",
  "total": "2599.98",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "product_name": "Laptop Dell XPS 13",
      "quantity": 2,
      "price": "1299.99",
      "subtotal": "2599.98"
    }
  ]
}
```

**Error Responses**:
- `400`: Cart is empty
- `400`: Insufficient stock for product
- `500`: Order creation failed (transaction rolled back)

#### Get Order Details
```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

**Response (200)**: Returns order with all items

---

## 🗄️ Database Schema

### Tables

#### users
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(255) | User name |
| email | VARCHAR(255) | Unique email |
| password | VARCHAR(255) | Hashed password |
| created_at | TIMESTAMP | - |
| updated_at | TIMESTAMP | - |

#### products
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(255) | Product name |
| description | TEXT | Product description |
| price | DECIMAL(10,2) | Product price |
| stock | INTEGER | Available quantity |
| status | ENUM | in_stock / out_of_stock |
| created_at | TIMESTAMP | - |
| updated_at | TIMESTAMP | - |

#### cart_items
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | FK to users |
| product_id | BIGINT | FK to products |
| quantity | INTEGER | Item quantity |
| created_at | TIMESTAMP | - |
| updated_at | TIMESTAMP | - |

#### orders
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | FK to users |
| order_number | VARCHAR(255) | Unique order ID |
| total | DECIMAL(10,2) | Order total amount |
| address | TEXT | Delivery address |
| phone | VARCHAR(255) | Contact phone |
| status | ENUM | pending/completed/cancelled |
| created_at | TIMESTAMP | - |
| updated_at | TIMESTAMP | - |

#### order_items
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| order_id | BIGINT | FK to orders |
| product_id | BIGINT | FK to products |
| product_name | VARCHAR(255) | Snapshot of name |
| quantity | INTEGER | Ordered quantity |
| price | DECIMAL(10,2) | Snapshot of price |
| subtotal | DECIMAL(10,2) | Calculated amount |
| created_at | TIMESTAMP | - |
| updated_at | TIMESTAMP | - |

### Relationships
- User → Orders (1:N)
- User → CartItems (1:N)
- Order → OrderItems (1:N)
- Product → OrderItems (1:N)
- Product → CartItems (1:N)

**Visual Diagram**: See `DATABASE_DIAGRAM.md`

---

## ⚙️ Business Rules

### Product Status Management
- Status automatically updates when stock changes
- `stock = 0` → status = `out_of_stock`
- `stock > 0` → status = `in_stock`
- Implemented using Eloquent Observer

### Order Creation Flow
1. User adds products to cart
2. User creates order with address & phone
3. System validates:
   - Cart is not empty
   - Sufficient stock for all items
4. Database transaction begins
5. Order record created with unique order_number
6. Order items created from cart items
7. Product stock decremented
8. Cart cleared
9. Transaction committed
10. Order details returned

### Stock Validation
- Cart cannot add more than available stock
- Order cannot be created if any item exceeds stock
- Stock decrements only after successful order creation

---

## 🧪 Testing the API

### Using Postman

1. Import the collection:
   - Open Postman
   - Import `Postman_Collection.json`

2. Test workflow:
   ```
   1. Login (token saved automatically)
   2. List Products
   3. Add products to Cart
   4. View Cart
   5. Create Order
   6. View Orders
   ```

### Manual Testing

```bash
# 1. Login and get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123"}'

# 2. List products (replace TOKEN)
curl http://localhost:8000/api/products \
  -H "Authorization: Bearer TOKEN"

# 3. Add to cart
curl -X POST http://localhost:8000/api/cart/add \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":2}'

# 4. Create order
curl -X POST http://localhost:8000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"address":"123 Main St","phone":"+1234567890"}'
```

---

## ✨ Features

- ✅ JWT Authentication with token-based security
- ✅ Complete CRUD operations for products
- ✅ Shopping cart management
- ✅ Order creation with transaction safety
- ✅ Automatic stock management
- ✅ Stock validation before checkout
- ✅ Automatic cart clearing after order
- ✅ Pagination for all list endpoints
- ✅ Search and filter products
- ✅ CORS enabled for frontend integration
- ✅ Clean code architecture with Eloquent ORM
- ✅ Database relationships properly configured

---

## 🛠️ Technologies Used

- **Framework**: Laravel 11
- **Authentication**: JWT (tymon/jwt-auth)
- **Database**: MySQL 8.0
- **ORM**: Eloquent
- **PHP Version**: 8.1+

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── ProductController.php
│   │   ├── CartController.php
│   │   └── OrderController.php
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       ├── Order.php
│       ├── OrderItem.php
│       └── CartItem.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── config/
    ├── auth.php
    ├── jwt.php
    └── cors.php
```

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- API route protection with middleware
- CSRF protection
- SQL injection prevention (Eloquent ORM)
- Input validation on all endpoints

---

## 📝 Notes

- All prices stored as DECIMAL(10,2) for precision
- Order numbers generated using: `ORD-{UNIQUE_ID}`
- Timestamps automatically managed by Laravel
- Soft deletes not implemented (can be added if needed)
- API responses in JSON format
- Error responses include validation details

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL service
sudo systemctl status mysql

# Verify credentials in .env
DB_USERNAME=admin
DB_PASSWORD=123
```

### JWT Token Error
```bash
# Regenerate JWT secret
php artisan jwt:secret --force

# Clear config cache
php artisan config:clear
```

### Migration Issues
```bash
# Reset database
php artisan migrate:fresh --seed
```

---

## 📞 Support

For issues or questions, please check:
1. Database credentials in `.env`
2. JWT secret is generated
3. Migrations are run
4. Server is running on port 8000

---

**Built with ❤️ using Laravel & Eloquent ORM**


- PHP 8.1+
- MySQL 8.0+
- Composer

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
composer install
```

3. Configure environment
```bash
cp .env.example .env
```

Update `.env` with your database credentials:
```
DB_DATABASE=ecommerce_task
DB_USERNAME=admin
DB_PASSWORD=123
```

4. Generate application key and JWT secret
```bash
php artisan key:generate
php artisan jwt:secret
```

5. Run migrations and seeders
```bash
php artisan migrate --seed
```

6. Start development server
```bash
php artisan serve
```

API will be available at `http://localhost:8000`

## Default Credentials

- Email: `admin@example.com`
- Password: `123`

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "123"
}
```

Response:
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Products

#### List Products
```http
GET /api/products?page=1&search=laptop&status=in_stock
Authorization: Bearer {token}
```

#### Create Product
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 10
}
```

#### Get Product
```http
GET /api/products/{id}
Authorization: Bearer {token}
```

#### Update Product
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 89.99,
  "stock": 15
}
```

#### Delete Product
```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

### Cart

#### Get Cart
```http
GET /api/cart
Authorization: Bearer {token}
```

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/{cartItemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/cart/{cartItemId}
Authorization: Bearer {token}
```

#### Clear Cart
```http
DELETE /api/cart/clear
Authorization: Bearer {token}
```

### Orders

#### List Orders
```http
GET /api/orders?page=1
Authorization: Bearer {token}
```

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "address": "123 Main St, City, Country",
  "phone": "+1234567890"
}
```

Response:
```json
{
  "order_number": "ORD-ABC123",
  "total": 299.98,
  "items": [...]
}
```

#### Get Order Details
```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

## Database Schema

### users
- id
- name
- email (unique)
- password
- created_at
- updated_at

### products
- id
- name
- description
- price (decimal)
- stock (integer)
- status (enum: in_stock, out_of_stock)
- created_at
- updated_at

### orders
- id
- user_id (FK)
- order_number (unique)
- total (decimal)
- address
- phone
- status (enum: pending, completed, cancelled)
- created_at
- updated_at

### order_items
- id
- order_id (FK)
- product_id (FK)
- product_name
- quantity
- price (decimal)
- subtotal (decimal)
- created_at
- updated_at

### cart_items
- id
- user_id (FK)
- product_id (FK)
- quantity
- created_at
- updated_at

## Features

- ✅ JWT Authentication
- ✅ Product CRUD with automatic stock status
- ✅ Shopping cart management
- ✅ Order creation with transaction safety
- ✅ Stock validation
- ✅ Automatic cart clearing after order
- ✅ Pagination support
- ✅ Search and filter products
- ✅ CORS enabled for frontend integration

## Business Logic

1. **Product Status**: Automatically updates to `out_of_stock` when stock = 0
2. **Order Creation**: 
   - Validates cart items exist
   - Checks stock availability
   - Creates order in database transaction
   - Decreases product stock
   - Clears user's cart
3. **Cart Management**: Validates stock before adding/updating items

## Testing

Use tools like Postman, Insomnia, or Thunder Client to test the API endpoints.

## Technologies

- Laravel 11
- JWT (tymon/jwt-auth)
- MySQL
- Eloquent ORM
