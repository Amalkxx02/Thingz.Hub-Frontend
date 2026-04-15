import { apiClient } from './apiClient';

class ThingError extends Error {
  constructor(message, status) {
    super(message.toUpperCase());
    this.name = 'ThingError';
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

export const thingService = {
  // GET a thing by id
  getThingById: async (id) => {
    try {
      const { response, data } = await apiClient.request(`/thingz/${id}`);
      if (!response.ok) throw new ThingError(formatError(data, 'SCAN_FAILURE'), response.status);
      return data;
    } catch (error) {
      if (error instanceof ThingError) throw error;
      throw new Error('NETWORK_INTERFERENCE');
    }
  },

  // GET all thingz that have a meta field (with intelligent caching)
  getThingzWithMeta: async (force = false) => {
    try {
      // Inventory Link: Check Local Cache First
      if (!force) {
        const cache = localStorage.getItem('hub_meta_inventory');
        if (cache) {
          const parsed = JSON.parse(cache);
          if (parsed && parsed.length > 0) return parsed;
        }
      }

      const { response, data } = await apiClient.request('/thingz');
      if (!response.ok) throw new ThingError(formatError(data, 'SCAN_FAILURE'), response.status);
      
      // Enrich with hex_id for high-speed WebSocket matching
      const enrichedData = data.map(thing => ({
        ...thing,
        id_hex: thing.id.replace(/-/g, '').toLowerCase()
      }));

      // Update Cache for future instant loads
      localStorage.setItem('hub_meta_inventory', JSON.stringify(enrichedData));
      return enrichedData;
    } catch (error) {
      if (error instanceof ThingError) throw error;
      throw new Error('NETWORK_INTERFERENCE');
    }
  },

  // GET all thing that dont have a meta field by device id
  getThingsByDevice: async (deviceId) => {
    try {
      const { response, data } = await apiClient.request(`/thingz/device/${deviceId}`);
      if (!response.ok) throw new ThingError(formatError(data, 'SCAN_FAILURE'), response.status);
      return data;
    } catch (error) {
      if (error instanceof ThingError) throw error;
      throw new Error('NETWORK_INTERFERENCE');
    }
  },

  // PATCH to update thing properties or meta metadata
  updateThing: async (id, updateData) => {
    try {
      const { response, data } = await apiClient.request(`/thingz/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new ThingError(formatError(data, 'UPDATE_FAILED'), response.status);
      
      // Invalidate Cache after mutation
      localStorage.removeItem('hub_meta_inventory');
      return data;
    } catch (error) {
      if (error instanceof ThingError) throw error;
      throw new Error('IO_LINK_FAILURE');
    }
  },

  // Alias for updateThing specifically focused on metadata
  updateMeta: async (id, metaData) => {
    return thingService.updateThing(id, metaData);
  },

  // DELETE a thing
  deleteThing: async (id) => {
    try {
      const { response, data } = await apiClient.request(`/thingz/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new ThingError(formatError(data, 'PURGE_FAILED'), response.status);

      // Invalidate Cache after mutation
      localStorage.removeItem('hub_meta_inventory');
      return data;
    } catch (error) {
      if (error instanceof ThingError) throw error;
      throw new Error('SYSTEM_INTERFERENCE');
    }
  }
};
