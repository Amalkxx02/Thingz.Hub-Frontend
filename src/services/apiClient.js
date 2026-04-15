const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const apiClient = {
  /**
   * Universal Request Wrapper with Automatic Token Refresh
   */
  request: async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // 1. Prepare base options and headers
    const accessToken = localStorage.getItem('access_token');
    const headers = {
      'Accept': 'application/json',
      ...options.headers,
    };
    
    // Add auth header if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      // 2. Perform initial request
      let response = await fetch(url, { ...options, headers });
      let data = await response.json();

      // 3. Check for Token Expiration (401 + specific detail)
      if (response.status === 401 && data.detail && data.detail.token_expired) {
        let refreshSuccessful = false;
        try {
          // 4. Attempt to Refresh Token
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

          const refreshResponse = await fetch(`${API_BASE_URL}/auths/refresh`, {
            method: 'POST',
            headers: { 
              'Accept': 'application/json',
              'Authorization': `Bearer ${refreshToken}`
            },
          });
          if (!refreshResponse.ok) throw new Error('REFRESH_SEQUENCE_FAILED');

          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.access_token;

          if (!newAccessToken) throw new Error('TOKEN_MALFORMED');

          localStorage.setItem('access_token', newAccessToken);
          refreshSuccessful = true;
          
          // 5. Update headers for retry
          headers['Authorization'] = `Bearer ${newAccessToken}`;
        } catch (refreshError) {
          // 6. Refresh failed, purge session and exit
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth?expired=true';
          throw new Error('SESSION_EXPIRED');
        }

        // 7. Perform the retry OUTSIDE the refresh try-catch to avoid logout on retry failure
        if (refreshSuccessful) {
          response = await fetch(url, { ...options, headers });
          data = await response.json();
        }
      }

      // Return both response and data for custom handling in services
      return { response, data };
    } catch (error) {
      throw error;
    }
  }
};
