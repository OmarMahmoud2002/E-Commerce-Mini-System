import { defineStore } from 'pinia';
import api from '../services/api';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    total: 0
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0)
  },

  actions: {
    async fetchCart() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/cart');
        this.items = response.data.items || [];
        this.total = response.data.total || 0;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch cart';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addToCart(product_id, quantity = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/cart/add', { product_id, quantity });
        await this.fetchCart();
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add to cart';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCartItem(product_id, quantity) {
      this.loading = true;
      this.error = null;
      try {
        await api.put(`/cart/${product_id}`, { quantity });
        await this.fetchCart();
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update cart';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeFromCart(product_id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/cart/${product_id}`);
        await this.fetchCart();
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to remove from cart';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async clearCart() {
      this.loading = true;
      this.error = null;
      try {
        await api.delete('/cart');
        this.items = [];
        this.total = 0;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to clear cart';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
