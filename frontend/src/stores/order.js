import { defineStore } from 'pinia';
import api from '../services/api';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    order: null,
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 10,
      last_page: 1
    }
  }),

  actions: {
    async fetchOrders(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/orders', { params: { page } });
        this.orders = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          total: response.data.total,
          per_page: response.data.per_page,
          last_page: response.data.last_page
        };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch orders';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrder(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/orders/${id}`);
        this.order = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch order';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createOrder(phone, address) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/orders', { phone, address });
        this.orders.unshift(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create order';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
