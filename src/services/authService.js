import { apiClient } from './apiClient';

class AuthError extends Error {
  constructor(message, status) {
    super(message.toUpperCase()); 
    this.name = 'AuthError';
    this.status = status;
  }
}

const formatError = (data, fallback = 'SEQUENCE_FAILED') => {
  let message = data.detail || data.message || fallback;
  if (Array.isArray(message)) {
    message = message[0].msg || 'INVALID_PACKET_FORMAT';
  }
  if (message.includes(':')) {
    message = message.split(':').pop().trim();
  }
  return message.toUpperCase(); 
};

export const authService = {
  login: async (email, password) => {
    try {
      const { response, data } = await apiClient.request('/auths/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new AuthError(formatError(data, 'IDENTITY_REJECTED'), response.status);
      if (data.access_token) localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
      
      return {
        success: true,
        user: { email, is_onboarded: data.is_onboarded }, 
        tokens: { access: data.access_token, refresh: data.refresh_token }
      };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new Error('INTERNAL_SERVER_ERROR');
    }
  },

  register: async (email, password) => {
    try {
      const { response, data } = await apiClient.request('/auths/sign_up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new AuthError(formatError(data, 'NODE_REJECTED'), response.status);
      return { success: true, message: data.message || 'ACCESS_GRANTED' };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new Error('CONNECTION_LOST_OR_OFFLINE');
    }
  },

  logout: async (isAll = true) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiClient.request(`/auths/sign_out?is_all=${isAll}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${refreshToken}` }
        });
      }
    } catch (error) {
      console.error('LOGOUT_SEQUENCE_INTERRUPTED');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth';
    }
  },

  refresh: async () => {
    // Note: We use raw fetch here to avoid circular dependency or infinite recursion in apiClient.request
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

      // We need to fetch API_BASE_URL here or define it once
      const API_BASE_URL = 'http://127.0.0.1:8000/api/v1'; 
      const response = await fetch(`${API_BASE_URL}/auths/refresh`, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });
      if (!response.ok) {
        throw new AuthError('REFRESH_SEQUENCE_TIMEOUT', response.status);
      }

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        return data.access_token;
      }
      throw new Error('INVALID_REFRESH_RESPONSE');
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('RECONNECT_FAILED');
    }
  }
};
