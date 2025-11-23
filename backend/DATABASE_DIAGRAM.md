# Database Schema Diagram

## Tables and Relationships

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴─────────────┬──────────────┐
    │                  │              │
    │                  │              │
    ▼                  ▼              ▼
┌───────────┐  ┌───────────────┐  ┌──────────────┐
│  ORDERS   │  │  CART_ITEMS   │  │              │
├───────────┤  ├───────────────┤  │              │
│ id (PK)   │  │ id (PK)       │  │              │
│ user_id◄──┘  │ user_id◄──────┘  │              │
│ order_num │  │ product_id◄───┐  │              │
│ total     │  │ quantity      │  │              │
│ address   │  │ created_at    │  │              │
│ phone     │  │ updated_at    │  │              │
│ status    │  └───────────────┘  │              │
│created_at │                     │              │
│updated_at │                     │              │
└─────┬─────┘                     │              │
      │                           │              │
      │ 1:N                       │              │
      │                           │              │
      ▼                           │              │
┌──────────────┐                  │              │
│ ORDER_ITEMS  │                  │              │
├──────────────┤                  │              │
│ id (PK)      │                  │              │
│ order_id◄────┘                  │              │
│ product_id◄──────────────────┐  │              │
│ product_name │                │  │              │
│ quantity     │                │  │              │
│ price        │                │  │              │
│ subtotal     │                │  │              │
│ created_at   │                │  │              │
│ updated_at   │                │  │              │
└──────────────┘                │  │              │
                                │  │              │
                                │  │              │
                        ┌───────┴──┴──────────────┘
                        │
                        │
                        ▼
                ┌──────────────┐
                │   PRODUCTS   │
                ├──────────────┤
                │ id (PK)      │
                │ name         │
                │ description  │
                │ price        │
                │ stock        │
                │ status       │
                │ created_at   │
                │ updated_at   │
                └──────────────┘
```

## Relationships

1. **Users → Orders**: One-to-Many
   - A user can have multiple orders
   - Each order belongs to one user

2. **Users → Cart Items**: One-to-Many
   - A user can have multiple cart items
   - Each cart item belongs to one user

3. **Orders → Order Items**: One-to-Many
   - An order contains multiple order items
   - Each order item belongs to one order

4. **Products → Order Items**: One-to-Many
   - A product can be in multiple order items
   - Each order item references one product

5. **Products → Cart Items**: One-to-Many
   - A product can be in multiple cart items
   - Each cart item references one product

## Key Constraints

- `users.email`: UNIQUE
- `orders.order_number`: UNIQUE
- Foreign Key: `orders.user_id` → `users.id` (CASCADE DELETE)
- Foreign Key: `order_items.order_id` → `orders.id` (CASCADE DELETE)
- Foreign Key: `order_items.product_id` → `products.id` (CASCADE DELETE)
- Foreign Key: `cart_items.user_id` → `users.id` (CASCADE DELETE)
- Foreign Key: `cart_items.product_id` → `products.id` (CASCADE DELETE)

## Business Rules

1. **Product Status**:
   - Automatically set to `out_of_stock` when stock = 0
   - Automatically set to `in_stock` when stock > 0

2. **Order Creation**:
   - Must have at least one cart item
   - All products must have sufficient stock
   - Stock is decremented after order creation
   - Cart is cleared after successful order

3. **Cart Management**:
   - Cannot add more quantity than available stock
   - Duplicate products update quantity instead of creating new records
