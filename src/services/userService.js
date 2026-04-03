const API_BASE_URL = 'http://127.0.0.1:8800/api/v1';

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

const formatUserError = (data, fallback = 'SEQUENCE_FAILED') => {
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
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('NO_TOKEN');

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new UserError(formatUserError(data, 'PROFILE_FETCH_FAILED'), response.status);
      }

      return data; // { user_id, name, email, profile_image_url }
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
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(onboardingData),
      });

      const data = await response.json();

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
