const API_BASE_URL = 'http://127.0.0.1:8800/api/v1';

class DeviceError extends Error {
  constructor(message, status) {
    super(message.toUpperCase());
    this.name = 'DeviceError';
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

export const deviceService = {
  getDevices: async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/devices`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new DeviceError(formatError(data, 'SCAN_FAILURE'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('NETWORK_INTERFERENCE');
    }
  },

  getDevice: async (id) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new DeviceError(formatError(data, 'GET_NODE_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('IO_LINK_FAILURE');
    }
  },

  registerDevice: async (name, type) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/devices`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, type }),
      });
      const data = await response.json();
      if (!response.ok) throw new DeviceError(formatError(data, 'NODE_REGISTRATION_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('HANDSHAKE_REJECTED');
    }
  },

  deleteDevice: async (id) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new DeviceError(formatError(data, 'PURGE_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('SYSTEM_INTERFERENCE');
    }
  },

  toggleStatus: async (id) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/devices/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new DeviceError(formatError(data, 'STATUS_TOGGLE_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('IO_LINK_FAILURE');
    }
  },

  rotateKey: async (id) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/devices/${id}/key`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new DeviceError(formatError(data, 'KEY_ROTATION_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('ENCRYPTION_LAYER_ERROR');
    }
  },

  revokeDevice: async (id) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/devices/${id}/revoked`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new DeviceError(formatError(data, 'REVOCATION_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('AUTH_SEQUENCE_INTERRUPTED');
    }
  }
};
