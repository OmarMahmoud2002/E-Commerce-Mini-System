<template>
  <Layout>
    <div class="dashboard">
      <h1>Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card purple">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ productStore.pagination.total }}</div>
            <div class="stat-label">Total Products</div>
          </div>
        </div>

        <div class="stat-card blue">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 2L1 8L9 14L17 8L9 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 16L9 22L17 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 8L9 14L17 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ orderStore.pagination.total }}</div>
            <div class="stat-label">Total Orders</div>
          </div>
        </div>

        <div class="stat-card green">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
              <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ cartStore.itemCount }}</div>
            <div class="stat-label">Cart Items</div>
          </div>
        </div>

        <div class="stat-card orange">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">${{ cartStore.total.toFixed(2) }}</div>
            <div class="stat-label">Cart Total</div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <div @click="showAddProductModal" class="action-card add-product">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <span class="action-label">Add New Product</span>
            <span class="action-description">Create a new product listing</span>
          </div>
          
          <router-link to="/products" class="action-card products">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="action-label">Manage Products</span>
            <span class="action-description">View, edit or delete products</span>
          </router-link>
          
          <router-link to="/orders" class="action-card orders">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2L1 8L9 14L17 8L9 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 16L9 22L17 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 8L9 14L17 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="action-label">View Orders</span>
            <span class="action-description">Track and manage customer orders</span>
          </router-link>
        </div>
      </div>

      <!-- Add Product Modal -->
      <div v-if="addModalOpen" class="modal-overlay" @click="closeAddModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Add New Product</h2>
            <button @click="closeAddModal" class="btn-close">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="submitAddProduct" class="product-form">
            <div class="form-group">
              <label for="add-name">Product Name</label>
              <input
                id="add-name"
                v-model="addForm.name"
                type="text"
                required
                placeholder="Enter product name"
              />
            </div>

            <div class="form-group">
              <label for="add-description">Description</label>
              <textarea
                id="add-description"
                v-model="addForm.description"
                required
                placeholder="Enter product description"
                rows="4"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="add-price">Price ($)</label>
                <input
                  id="add-price"
                  v-model.number="addForm.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                />
              </div>

              <div class="form-group">
                <label for="add-stock">Stock</label>
                <input
                  id="add-stock"
                  v-model.number="addForm.stock"
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeAddModal" class="btn-cancel">Cancel</button>
              <button type="submit" class="btn-submit">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Layout from '../components/Layout.vue';
import { useProductStore } from '../stores/product';
import { useOrderStore } from '../stores/order';
import { useCartStore } from '../stores/cart';

const productStore = useProductStore();
const orderStore = useOrderStore();
const cartStore = useCartStore();

const addModalOpen = ref(false);
const addForm = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0
});

const showAddProductModal = () => {
  addModalOpen.value = true;
};

const closeAddModal = () => {
  addModalOpen.value = false;
  addForm.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  };
};

const submitAddProduct = async () => {
  try {
    await productStore.createProduct(addForm.value);
    alert('Product added successfully!');
    closeAddModal();
    await productStore.fetchProducts();
  } catch (error) {
    alert('Failed to add product. Please try again.');
    console.error(error);
  }
};

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    orderStore.fetchOrders(),
    cartStore.fetchCart()
  ]);
});
</script>

<style scoped>
.dashboard {
  width: 100%;
  padding: 30px 40px;
  box-sizing: border-box;
  min-height: 100vh;
}

h1 {
  color: #2c3e50;
  margin: 0 0 30px 0;
  font-size: 32px;
}

h2 {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-gradient-start), var(--card-gradient-end));
}

.stat-card.purple {
  --card-gradient-start: #667eea;
  --card-gradient-end: #764ba2;
}

.stat-card.blue {
  --card-gradient-start: #4facfe;
  --card-gradient-end: #00f2fe;
}

.stat-card.green {
  --card-gradient-start: #43e97b;
  --card-gradient-end: #38f9d7;
}

.stat-card.orange {
  --card-gradient-start: #fa709a;
  --card-gradient-end: #fee140;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.purple .stat-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.stat-card.blue .stat-icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.stat-card.green .stat-icon {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
}

.stat-card.orange .stat-icon {
  background: linear-gradient(135deg, #fa709a, #fee140);
  color: white;
}

.stat-icon svg {
  width: 32px;
  height: 32px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quick-actions {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.action-card {
  background: white;
  border: 2px solid #e1e8ed;
  border-radius: 16px;
  padding: 32px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--action-gradient-start), var(--action-gradient-end));
  opacity: 0;
  transition: opacity 0.3s;
}

.action-card.products {
  --action-gradient-start: #667eea;
  --action-gradient-end: #764ba2;
}

.action-card.orders {
  --action-gradient-start: #4facfe;
  --action-gradient-end: #00f2fe;
}

.action-card.add-product {
  --action-gradient-start: #43e97b;
  --action-gradient-end: #38f9d7;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: transparent;
}

.action-card:hover::before {
  opacity: 1;
}

.action-card:hover .action-icon,
.action-card:hover .action-label,
.action-card:hover .action-description {
  color: white;
  position: relative;
  z-index: 1;
}

.action-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.action-card.products .action-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.action-card.orders .action-icon {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.action-card.add-product .action-icon {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.action-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}

.action-label {
  font-size: 20px;
  font-weight: 600;
  transition: color 0.3s;
}

.action-description {
  font-size: 14px;
  color: #7f8c8d;
  transition: color 0.3s;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 2px solid #e1e8ed;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.modal-header h2 {
  margin: 0;
  color: white;
  font-size: 24px;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-close svg {
  width: 20px;
  height: 20px;
  color: white;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.product-form {
  padding: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
}

.btn-cancel {
  padding: 12px 24px;
  background: #e1e8ed;
  color: #2c3e50;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.3);
}

.btn-submit svg {
  width: 18px;
  height: 18px;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 233, 123, 0.5);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
  }
}
</style>
