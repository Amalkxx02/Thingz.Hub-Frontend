import { apiClient } from './apiClient';

export const thingService = {
  getThingById: (id) => apiClient.get(`/thingz/${id}`),
  getThingz: () => apiClient.get('/thingz'),
  getThingsByDevice: (deviceId) => apiClient.get(`/thingz/device/${deviceId}`),
  updateThing: (id, data) => apiClient.put(`/thingz/${id}`, data),
  deleteThing: (id) => apiClient.delete(`/thingz/${id}`),
};
