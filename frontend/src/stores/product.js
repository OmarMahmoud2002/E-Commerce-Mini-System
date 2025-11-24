import { defineStore } from 'pinia';
import api from '../services/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    product: null,
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
    async fetchProducts(page = 1, search = '', status = '') {
      this.loading = true;
      this.error = null;
      try {
        const params = { page };
        if (search) params.search = search;
        if (status) params.status = status;

        const response = await api.get('/products', { params });
        this.products = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          total: response.data.total,
          per_page: response.data.per_page,
          last_page: response.data.last_page
        };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch products';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchProduct(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/products/${id}`);
        this.product = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch product';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(data) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/products', data);
        this.products.unshift(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create product';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(id, data) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/products/${id}`, data);
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update product';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/products/${id}`);
        this.products = this.products.filter(p => p.id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete product';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
