<template>
  <Layout>
    <div class="orders">
      <h1>Orders</h1>

      <div v-if="orderStore.loading" class="loading">Loading...</div>

      <div v-else-if="orderStore.orders.length === 0" class="empty-state">
        <div class="empty-icon">🛒</div>
        <p>No orders found</p>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orderStore.orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-left">
              <div class="order-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2L1 8L9 14L17 8L9 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M1 16L9 22L17 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M1 8L9 14L17 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="order-number">
                <span class="label">Order #</span>
                <span class="number">{{ order.order_number }}</span>
              </div>
            </div>
            <div :class="['order-status', order.status]">
              <span class="status-dot"></span>
              {{ order.status }}
            </div>
          </div>
          
          <div class="order-info">
            <div class="info-row">
              <div class="info-icon">📅</div>
              <div class="info-content">
                <span class="label">Date</span>
                <span class="value">{{ formatDate(order.created_at) }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">💰</div>
              <div class="info-content">
                <span class="label">Total</span>
                <span class="value total-amount">${{ order.total_amount }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">📦</div>
              <div class="info-content">
                <span class="label">Items</span>
                <span class="value">{{ order.items?.length || 0 }} items</span>
              </div>
            </div>
          </div>

          <button @click="viewOrderDetails(order.id)" class="btn-details">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="2"/>
              <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" stroke-width="2"/>
            </svg>
            View Details
          </button>
        </div>
      </div>

      <div v-if="orderStore.pagination.last_page > 1" class="pagination">
        <button
          @click="changePage(orderStore.pagination.current_page - 1)"
          :disabled="orderStore.pagination.current_page === 1"
          class="btn-page"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ orderStore.pagination.current_page }} of {{ orderStore.pagination.last_page }}
        </span>
        <button
          @click="changePage(orderStore.pagination.current_page + 1)"
          :disabled="orderStore.pagination.current_page === orderStore.pagination.last_page"
          class="btn-page"
        >
          Next
        </button>
      </div>

      <div v-if="selectedOrder" class="modal" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Order Details</h2>
            <button @click="closeModal" class="btn-close">×</button>
          </div>

          <div class="order-details">
            <div class="detail-row">
              <span class="label">Order Number:</span>
              <span>{{ selectedOrder.order_number }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span :class="['order-status', selectedOrder.status]">
                {{ selectedOrder.status }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span>{{ formatDate(selectedOrder.created_at) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total:</span>
              <span class="total-amount">${{ selectedOrder.total_amount }}</span>
            </div>
          </div>

          <h3>Order Items</h3>
          <div class="order-items">
            <div v-for="item in selectedOrder.items" :key="item.id" class="item-row">
              <div class="item-info">
                <div class="item-name">{{ item.product_name }}</div>
                <div class="item-meta">
                  ${{ item.price }} × {{ item.quantity }}
                </div>
              </div>
              <div class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Layout from '../components/Layout.vue';
import { useOrderStore } from '../stores/order';

const orderStore = useOrderStore();
const selectedOrder = ref(null);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const changePage = (page) => {
  orderStore.fetchOrders(page);
};

const viewOrderDetails = async (orderId) => {
  try {
    selectedOrder.value = await orderStore.fetchOrder(orderId);
  } catch (err) {
    console.error('Failed to load order details:', err);
    alert('Failed to load order details');
  }
};

const closeModal = () => {
  selectedOrder.value = null;
};

onMounted(() => {
  orderStore.fetchOrders();
});
</script>

<style scoped>
.orders {
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

h3 {
  color: #2c3e50;
  margin: 24px 0 16px 0;
  font-size: 18px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #7f8c8d;
  font-size: 18px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  color: #7f8c8d;
  font-size: 18px;
}

.orders-list {
  display: grid;
  gap: 24px;
  margin-bottom: 30px;
}

.order-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f3f7;
}

.order-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.order-icon svg {
  width: 24px;
  height: 24px;
}

.order-number {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-number .label {
  font-size: 12px;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-number .number {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.order-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.order-status.pending {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  color: #856404;
}

.order-status.pending .status-dot {
  background: #856404;
}

.order-status.completed {
  background: linear-gradient(135deg, #d4edda, #a8e6cf);
  color: #155724;
}

.order-status.completed .status-dot {
  background: #155724;
}

.order-status.cancelled {
  background: linear-gradient(135deg, #f8d7da, #ff6b9d);
  color: #721c24;
}

.order-status.cancelled .status-dot {
  background: #721c24;
}

.order-info {
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.info-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-content .label {
  font-size: 12px;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-content .value {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.total-amount {
  font-size: 20px !important;
  font-weight: 700 !important;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-details {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-details svg {
  width: 20px;
  height: 20px;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 32px;
  color: #7f8c8d;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  transition: color 0.3s;
}

.btn-close:hover {
  color: #2c3e50;
}

.order-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.order-items {
  display: grid;
  gap: 12px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.item-meta {
  font-size: 14px;
  color: #7f8c8d;
}

.item-total {
  font-size: 18px;
  font-weight: 700;
  color: #27ae60;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
