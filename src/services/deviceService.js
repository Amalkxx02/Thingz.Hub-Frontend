import { apiClient } from './apiClient';

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
      const { response, data } = await apiClient.request('/devices');
      if (!response.ok) throw new DeviceError(formatError(data, 'SCAN_FAILURE'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('NETWORK_INTERFERENCE');
    }
  },

  getDevice: async (id) => {
    try {
      const { response, data } = await apiClient.request(`/devices/${id}`);
      if (!response.ok) throw new DeviceError(formatError(data, 'GET_NODE_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('IO_LINK_FAILURE');
    }
  },

  registerDevice: async (name, type) => {
    try {
      const { response, data } = await apiClient.request('/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });
      if (!response.ok) throw new DeviceError(formatError(data, 'NODE_REGISTRATION_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('HANDSHAKE_REJECTED');
    }
  },

  deleteDevice: async (id) => {
    try {
      const { response, data } = await apiClient.request(`/devices/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new DeviceError(formatError(data, 'PURGE_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('SYSTEM_INTERFERENCE');
    }
  },

  toggleStatus: async (id) => {
    try {
      const { response, data } = await apiClient.request(`/devices/${id}/status`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new DeviceError(formatError(data, 'STATUS_TOGGLE_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('IO_LINK_FAILURE');
    }
  },

  rotateKey: async (id) => {
    try {
      const { response, data } = await apiClient.request(`/devices/${id}/key`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new DeviceError(formatError(data, 'KEY_ROTATION_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('ENCRYPTION_LAYER_ERROR');
    }
  },

  revokeDevice: async (id) => {
    try {
      const { response, data } = await apiClient.request(`/devices/${id}/revoked`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new DeviceError(formatError(data, 'REVOCATION_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('AUTH_SEQUENCE_INTERRUPTED');
    }
  },

  revokeAllDevices: async () => {
    try {
      const { response, data } = await apiClient.request('/devices/revoked', {
        method: 'PATCH',
      });
      if (!response.ok) throw new DeviceError(formatError(data, 'MASS_REVOCATION_FAILED'), response.status);
      return data;
    } catch (error) {
      if (error instanceof DeviceError) throw error;
      throw new Error('SYSTEM_AUTH_INTERRUPTED');
    }
  }
};
