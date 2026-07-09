import { apiClient } from './apiClient';

export const apiDevice = {
  getDevices: () => apiClient.get('/devices'),
  createDevice: (credentials) => apiClient.post('/devices',credentials),
};
