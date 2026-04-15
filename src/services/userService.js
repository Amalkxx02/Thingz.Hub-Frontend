import { apiClient } from './apiClient';

/**
 * Custom Error for User Profile Failures
 */
class UserError extends Error {
  constructor(message, status) {
    super(message.toUpperCase()); 
    this.name = 'UserError';
    this.status = status;
  }
}

const formatUserError = (data, fallback = 'PROFILE_FETCH_FAILED') => {
  let message = data.detail || data.message || fallback;
  if (Array.isArray(message)) {
    message = message[0].msg || 'INVALID_PACKET_FORMAT';
  }
  if (message.includes(':')) {
    message = message.split(':').pop().trim();
  }
  return message.toUpperCase(); 
};

export const userService = {
  /**
   * Fetch current user profile
   */
  getProfile: async () => {
    try {
      const { response, data } = await apiClient.request('/users');
      if (!response.ok) {
        throw new UserError(formatUserError(data, 'PROFILE_FETCH_FAILED'), response.status);
      }
      return data; 
    } catch (error) {
      if (error instanceof UserError) throw error;
      throw new Error('HUB_OFFLINE');
    }
  },

  /**
   * Complete User Onboarding
   */
  onboard: async (onboardingData) => {
    try {
      const { response, data } = await apiClient.request('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      });

      if (!response.ok) {
        throw new UserError(formatUserError(data, 'ONBOARDING_FAILED'), response.status);
      }

      return data;
    } catch (error) {
      if (error instanceof UserError) throw error;
      throw new Error('HUB_OFFLINE');
    }
  }
};
