<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <div class="auth-image">
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop" alt="Shopping">
        <div class="image-overlay">
          <h1>Welcome Back!</h1>
          <p>Login to access your E-Commerce dashboard</p>
        </div>
      </div>
      
      <div class="auth-card">
        <div class="auth-header">
          <h2>Sign In</h2>
          <p>Enter your credentials to continue</p>
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="admin@example.com"
            />
          </div>

          <div class="form-group">
            <label for="password">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Enter your password"
            />
          </div>

          <div v-if="authStore.error" class="error-message">
            {{ authStore.error }}
          </div>

          <button type="submit" :disabled="authStore.loading" class="btn-primary">
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </button>

          <p class="auth-footer">
            Don't have an account?
            <router-link to="/register">Create Account</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const handleLogin = async () => {
  try {
    await authStore.login(form.email, form.password);
    router.push('/');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1100px;
  width: 100%;
  max-height: 90vh;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.auth-image {
  position: relative;
  overflow: hidden;
}

.auth-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: white;
  text-align: center;
}

.image-overlay h1 {
  font-size: 42px;
  margin-bottom: 16px;
  font-weight: 700;
}

.image-overlay p {
  font-size: 18px;
  opacity: 0.95;
}

.auth-card {
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-header {
  margin-bottom: 40px;
}

.auth-header h2 {
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
}

.auth-header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 15px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 14px;
}

label svg {
  width: 18px;
  height: 18px;
  color: #667eea;
}

input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  background: linear-gradient(135deg, #fee, #fdd);
  color: #c33;
  padding: 14px 18px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  border-left: 4px solid #c33;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-bottom: 20px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  color: #7f8c8d;
  font-size: 14px;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

.auth-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 968px) {
  .auth-container {
    padding: 10px;
  }

  .auth-wrapper {
    grid-template-columns: 1fr;
    max-height: none;
  }
  
  .auth-image {
    display: none;
  }
  
  .auth-card {
    padding: 40px 30px;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }
  
  .auth-header h2 {
    font-size: 26px;
  }
}
</style>
