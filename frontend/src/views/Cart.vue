<template>
  <Layout>
    <div class="cart">
      <div class="cart-header">
        <h1>Shopping Cart</h1>
        <button v-if="cartStore.items.length > 0" @click="clearCartConfirm" class="btn-clear">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Clear Cart
        </button>
      </div>

      <div v-if="cartStore.loading" class="loading">Loading...</div>

      <div v-else-if="cartStore.items.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
            <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to get started!</p>
        <router-link to="/products" class="btn-shop">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Browse Products
        </router-link>
      </div>

      <div v-else class="cart-container">
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="getProductImage(item.product?.name)" :alt="item.product?.name" />
            </div>
            
            <div class="item-details">
              <h3>{{ item.product?.name }}</h3>
              <p class="item-description">{{ item.product?.description }}</p>
              <div class="item-price">${{ item.product?.price }} <span>per item</span></div>
            </div>

            <div class="item-quantity">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button @click="decrementQuantity(item)" :disabled="item.quantity <= 1">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <input type="number" v-model.number="item.quantity" @change="updateQuantity(item)" min="1" :max="item.product?.stock" />
                <button @click="incrementQuantity(item)" :disabled="item.quantity >= item.product?.stock">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <div class="stock-info">{{ item.product?.stock }} in stock</div>
            </div>

            <div class="item-total">
              <div class="total-label">Subtotal:</div>
              <div class="total-value">${{ (item.product?.price * item.quantity).toFixed(2) }}</div>
            </div>

            <button @click="removeItem(item)" class="btn-remove">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <h2>Order Summary</h2>
          
          <div class="summary-row">
            <span>Items ({{ cartStore.itemCount }}):</span>
            <span>${{ cartStore.total.toFixed(2) }}</span>
          </div>
          
          <div class="summary-row">
            <span>Shipping:</span>
            <span class="free">Free</span>
          </div>
          
          <div class="summary-divider"></div>
          
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ cartStore.total.toFixed(2) }}</span>
          </div>

          <div class="checkout-form">
            <h3>Delivery Information</h3>
            
            <div class="form-group">
              <label for="phone">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Phone Number
              </label>
              <input v-model="checkoutForm.phone" type="tel" id="phone" placeholder="01234567890" required />
            </div>

            <div class="form-group">
              <label for="address">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Delivery Address
              </label>
              <textarea v-model="checkoutForm.address" id="address" rows="3" placeholder="Street, City, Country" required></textarea>
            </div>
          </div>

          <button @click="checkout" :disabled="!checkoutForm.phone || !checkoutForm.address || cartStore.loading" class="btn-checkout">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
              <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ cartStore.loading ? 'Processing...' : 'Place Order' }}
          </button>

          <div class="security-note">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Secure checkout</span>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Layout from '../components/Layout.vue';
import { useCartStore } from '../stores/cart';
import { useOrderStore } from '../stores/order';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

const checkoutForm = ref({
  phone: '',
  address: ''
});

onMounted(async () => {
  await cartStore.fetchCart();
});

const getProductImage = (productName) => {
  const imageMap = {
    'Laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    'Phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    'Keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    'Mouse': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    'Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    'Tablet': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
    'Camera': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
    'Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    'Smartwatch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
  };
  
  return imageMap[productName] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400';
};

const incrementQuantity = async (item) => {
  if (item.quantity < item.product.stock) {
    await cartStore.updateCartItem(item.product_id, item.quantity + 1);
  }
};

const decrementQuantity = async (item) => {
  if (item.quantity > 1) {
    await cartStore.updateCartItem(item.product_id, item.quantity - 1);
  }
};

const updateQuantity = async (item) => {
  if (item.quantity >= 1 && item.quantity <= item.product.stock) {
    await cartStore.updateCartItem(item.product_id, item.quantity);
  }
};

const removeItem = async (item) => {
  if (confirm(`Remove ${item.product.name} from cart?`)) {
    await cartStore.removeFromCart(item.product_id);
  }
};

const clearCartConfirm = async () => {
  if (confirm('Are you sure you want to clear your entire cart?')) {
    await cartStore.clearCart();
  }
};

const checkout = async () => {
  if (!checkoutForm.value.phone || !checkoutForm.value.address) {
    alert('Please fill in phone and address');
    return;
  }

  try {
    await orderStore.createOrder(checkoutForm.value.phone, checkoutForm.value.address);
    alert('Order placed successfully!');
    router.push('/orders');
  } catch (error) {
    alert('Failed to place order. Please try again.');
    console.error(error);
  }
};
</script>

<style scoped>
.cart {
  width: 100%;
  padding: 30px 40px;
  box-sizing: border-box;
  min-height: 100vh;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 32px;
}

.btn-clear {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-clear svg {
  width: 18px;
  height: 18px;
}

.btn-clear:hover {
  background: #ee5a52;
  transform: translateY(-2px);
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #7f8c8d;
}

.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
}

.empty-icon {
  margin-bottom: 24px;
}

.empty-icon svg {
  width: 120px;
  height: 120px;
  color: #dfe6e9;
}

.empty-state h2 {
  color: #2c3e50;
  margin: 0 0 12px 0;
  font-size: 28px;
}

.empty-state p {
  color: #7f8c8d;
  margin: 0 0 32px 0;
  font-size: 16px;
}

.btn-shop {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-shop svg {
  width: 20px;
  height: 20px;
}

.btn-shop:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.cart-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  display: grid;
  grid-template-columns: 120px 1fr auto auto auto;
  gap: 24px;
  align-items: center;
  transition: all 0.3s;
}

.cart-item:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.item-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-size: 20px;
}

.item-description {
  color: #7f8c8d;
  margin: 0 0 12px 0;
  font-size: 14px;
}

.item-price {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.item-price span {
  font-size: 12px;
  font-weight: 400;
  color: #7f8c8d;
  margin-left: 4px;
}

.item-quantity {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-quantity label {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  padding: 4px;
}

.quantity-controls button {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.quantity-controls button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-controls button svg {
  width: 16px;
  height: 16px;
}

.quantity-controls input {
  width: 50px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}

.stock-info {
  font-size: 11px;
  color: #7f8c8d;
  text-align: center;
}

.item-total {
  text-align: right;
}

.total-label {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.total-value {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
}

.btn-remove {
  width: 40px;
  height: 40px;
  border: 2px solid #ff6b6b;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  color: #ff6b6b;
}

.btn-remove:hover {
  background: #ff6b6b;
  color: white;
  transform: scale(1.1);
}

.btn-remove svg {
  width: 20px;
  height: 20px;
}

.cart-summary {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.cart-summary h2 {
  color: #2c3e50;
  margin: 0 0 24px 0;
  font-size: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 16px;
}

.summary-row.total {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
}

.free {
  color: #43e97b;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: #e1e8ed;
  margin: 16px 0;
}

.checkout-form {
  margin: 24px 0;
}

.checkout-form h3 {
  color: #2c3e50;
  margin: 0 0 16px 0;
  font-size: 18px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group label svg {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.btn-checkout {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-bottom: 16px;
}

.btn-checkout svg {
  width: 20px;
  height: 20px;
}

.btn-checkout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #7f8c8d;
  font-size: 13px;
}

.security-note svg {
  width: 16px;
  height: 16px;
  color: #43e97b;
}

@media (max-width: 1200px) {
  .cart-container {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 16px;
  }
  
  .item-quantity,
  .item-total {
    grid-column: 1 / -1;
  }
  
  .btn-remove {
    grid-column: 1 / -1;
    width: 100%;
  }
}
</style>
