const API_BASE_URL = 'http://127.0.0.1:8800/api/v1';

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
      const response = await fetch(`${API_BASE_URL}/auths/sign_in`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/auths/sign_up`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new AuthError(formatError(data, 'NODE_REJECTED'), response.status);
      return { success: true, message: data.message || 'ACCESS_GRANTED' };
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new Error('CONNECTION_LOST_OR_OFFLINE');
    }
  },

  logout: async (isAll = true) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      await fetch(`${API_BASE_URL}/auths/sign_out?is_all=${isAll}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${accessToken}` }
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  refresh: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await fetch(`${API_BASE_URL}/auths/refresh`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const data = await response.json();
      if (!response.ok) throw new AuthError('REFRESH_SEQUENCE_TIMEOUT', response.status);
      if (data.access_token) localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error) {
      throw new Error('RECONNECT_FAILED');
    }
  }
};
