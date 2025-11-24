<template>
  <Layout>
    <div class="products">
      <div class="page-header">
        <h1>Products Management</h1>
        <button @click="showCreateModal = true" class="btn-primary">
          + Add Product
        </button>
      </div>

      <div class="filters">
        <input
          v-model="search"
          @input="handleSearch"
          type="text"
          placeholder="Search products..."
          class="search-input"
        />
        <select v-model="statusFilter" @change="handleFilter" class="status-filter">
          <option value="">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      <div v-if="productStore.loading" class="loading">Loading...</div>

      <div v-else class="products-grid">
        <div 
          v-for="product in productStore.products" 
          :key="product.id" 
          :class="['product-card', { 'out-of-stock': product.stock <= 0 }]"
        >
          <div class="product-image">
            <img :src="getProductImage(product.name)" :alt="product.name" />
            <span :class="['status-badge', product.stock > 0 ? 'in_stock' : 'out_of_stock']">
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="product-desc">{{ product.description }}</p>
            <div class="product-meta">
              <div class="price-section">
                <span class="price">${{ product.price }}</span>
                <span class="price-label">Price</span>
              </div>
              <div class="stock-section">
                <span class="stock-value">{{ product.stock }}</span>
                <span class="stock-label">{{ product.stock > 0 ? 'Available' : 'Unavailable' }}</span>
              </div>
            </div>
          </div>
          <div class="product-actions">
            <button 
              v-if="product.stock > 0" 
              @click="addToCart(product)" 
              class="btn-add-cart" 
              title="Add to Cart"
            >
              <span class="icon">🛒</span> Add to Cart
            </button>
            <button 
              v-else 
              disabled 
              class="btn-out-of-stock" 
              title="Out of Stock"
            >
              <span class="icon">❌</span> Out of Stock
            </button>
            <button @click="editProduct(product)" class="btn-edit">
              <span class="icon">✏️</span> Edit
            </button>
            <button @click="deleteProductConfirm(product.id)" class="btn-delete">
              <span class="icon">🗑️</span> Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="productStore.pagination.last_page > 1" class="pagination">
        <button
          @click="changePage(productStore.pagination.current_page - 1)"
          :disabled="productStore.pagination.current_page === 1"
          class="btn-page"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ productStore.pagination.current_page }} of {{ productStore.pagination.last_page }}
        </span>
        <button
          @click="changePage(productStore.pagination.current_page + 1)"
          :disabled="productStore.pagination.current_page === productStore.pagination.last_page"
          class="btn-page"
        >
          Next
        </button>
      </div>

      <div v-if="showCreateModal || editingProduct" class="modal" @click.self="closeModal">
        <div class="modal-content">
          <h2>{{ editingProduct ? 'Edit Product' : 'Create Product' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name</label>
              <input v-model="form.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.description" required></textarea>
            </div>
            <div class="form-group">
              <label>Price</label>
              <input v-model.number="form.price" type="number" step="0.01" required />
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input v-model.number="form.stock" type="number" required />
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
              <button type="submit" :disabled="productStore.loading" class="btn-primary">
                {{ productStore.loading ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Layout from '../components/Layout.vue';
import { useProductStore } from '../stores/product';
import { useCartStore } from '../stores/cart';

const productStore = useProductStore();
const cartStore = useCartStore();

const search = ref('');
const statusFilter = ref('');
const showCreateModal = ref(false);
const editingProduct = ref(null);

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0
});

const handleSearch = () => {
  productStore.fetchProducts(1, search.value, statusFilter.value);
};

const handleFilter = () => {
  productStore.fetchProducts(1, search.value, statusFilter.value);
};

const changePage = (page) => {
  productStore.fetchProducts(page, search.value, statusFilter.value);
};

const editProduct = (product) => {
  editingProduct.value = product;
  form.name = product.name;
  form.description = product.description;
  form.price = product.price;
  form.stock = product.stock;
};

const closeModal = () => {
  showCreateModal.value = false;
  editingProduct.value = null;
  Object.assign(form, { name: '', description: '', price: 0, stock: 0 });
};

const handleSubmit = async () => {
  try {
    if (editingProduct.value) {
      await productStore.updateProduct(editingProduct.value.id, form);
    } else {
      await productStore.createProduct(form);
    }
    closeModal();
    await productStore.fetchProducts(1, search.value, statusFilter.value);
  } catch (error) {
    alert('Operation failed');
  }
};

const deleteProductConfirm = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productStore.deleteProduct(id);
    } catch (error) {
      alert('Delete failed');
    }
  }
};

const addToCart = async (product) => {
  // التحقق من الـ stock قبل الإضافة
  if (product.stock <= 0) {
    alert('Sorry, this product is out of stock!');
    return;
  }
  
  try {
    await cartStore.addToCart(product.id, 1);
    alert(`${product.name} added to cart successfully!`);
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to add to cart. Please try again.';
    alert(errorMessage);
  }
};

const getProductImage = (productName) => {
  const imageMap = {
    'Laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    'Phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    'Keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    'Mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    'Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    'Tablet': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
    'Camera': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
    'Speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    'Smartwatch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
  };
  
  for (const key in imageMap) {
    if (productName.toLowerCase().includes(key.toLowerCase())) {
      return imageMap[key];
    }
  }
  
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400';
};

onMounted(() => {
  productStore.fetchProducts();
});
</script>

<style scoped>
.products {
  width: 100%;
  padding: 30px 40px;
  box-sizing: border-box;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
}

h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 32px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-input,
.status-filter {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.search-input {
  flex: 1;
  max-width: 400px;
  min-width: 200px;
}

.status-filter {
  min-width: 150px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #7f8c8d;
  font-size: 18px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
  align-items: start;
}

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s, opacity 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.product-card.out-of-stock {
  opacity: 0.7;
}

.product-card.out-of-stock::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.product-card.out-of-stock:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.product-image {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.status-badge.in_stock {
  background: rgba(76, 175, 80, 0.95);
  color: white;
}

.status-badge.out_of_stock {
  background: rgba(244, 67, 54, 0.95);
  color: white;
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.product-info {
  padding: 20px;
  flex: 1;
}

.product-info h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 700;
}

.product-desc {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 16px;
}

.price-section,
.stock-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #27ae60;
  margin-bottom: 4px;
}

.price-label,
.stock-label {
  font-size: 11px;
  color: #7f8c8d;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.stock-value {
  font-size: 20px;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 4px;
}

.product-actions {
  display: flex;
  gap: 8px;
  padding: 0 20px 20px 20px;
}

.btn-add-cart,
.btn-edit,
.btn-delete {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-add-cart {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.btn-add-cart {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.btn-out-of-stock {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  color: white;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-edit {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.btn-delete {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
}

.btn-add-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.4);
}

.btn-out-of-stock:hover {
  transform: none;
  box-shadow: none;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

.btn-add-cart .icon,
.btn-out-of-stock .icon,
.btn-edit .icon,
.btn-delete .icon {
  font-size: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.btn-page {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-page:hover:not(:disabled) {
  background: #5568d3;
}

.btn-page:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.page-info {
  color: #7f8c8d;
  font-weight: 500;
}

.btn-primary {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
}

.modal-content h2 {
  margin: 0 0 24px 0;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #555;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 10px 20px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .filters {
    flex-direction: column;
    width: 100%;
  }

  .search-input {
    max-width: none;
    width: 100%;
  }

  .status-filter {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}
</style>
