<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>E-Commerce</h1>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item">
          <span>📊</span>
          Dashboard
        </router-link>
        <router-link to="/products" class="nav-item">
          <span>📦</span>
          Products
        </router-link>
        <router-link to="/cart" class="nav-item">
          <span>🛒</span>
          Cart
          <span v-if="cartStore.itemCount > 0" class="cart-badge">{{ cartStore.itemCount }}</span>
        </router-link>
        <router-link to="/orders" class="nav-item">
          <span>�</span>
          Orders
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-name">{{ authStore.user?.name }}</div>
          <div class="user-email">{{ authStore.user?.email }}</div>
        </div>
        <button @click="handleLogout" class="btn-logout">
          Logout
        </button>
      </div>
    </aside>

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

onMounted(async () => {
  await cartStore.fetchCart();
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background: #f5f5f5;
}

.sidebar {
  width: 260px;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  gap: 12px;
  font-size: 15px;
  position: relative;
}

.nav-item span {
  font-size: 20px;
}

.cart-badge {
  position: absolute;
  right: 20px;
  background: #e74c3c;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-left: 3px solid #3498db;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  margin-bottom: 12px;
}

.user-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.user-email {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  word-break: break-word;
}

.btn-logout {
  width: 100%;
  padding: 10px;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #e74c3c;
}

.content {
  flex: 1;
  margin-left: 260px;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }
  
  .content {
    margin-left: 80px;
    padding: 0;
  }

  .sidebar-header h1 {
    font-size: 18px;
    text-align: center;
  }

  .nav-item {
    justify-content: center;
    padding: 14px 10px;
  }

  .nav-item span {
    margin-right: 0;
  }

  .user-info,
  .btn-logout {
    display: none;
  }

  .content {
    margin-left: 80px;
  }
}
</style>
