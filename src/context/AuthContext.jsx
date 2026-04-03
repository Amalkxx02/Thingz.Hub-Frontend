import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { showToast } = useToast();

  const loadProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setUser({ ...profile, is_onboarded: true });
    } catch (error) {
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      loadProfile();
    } else {
      setInitializing(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      showToast('SYSTEM: VERIFYING_USER_STATE...', 'info');
      const [response] = await Promise.all([
        authService.login(email, password),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      if (response.user.is_onboarded) {
        await loadProfile();
      } else {
        setUser(response.user);
      }
      
      showToast('ACCESS_GRANTED: WELCOME_TO_HUB', 'success');
      return response;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    try {
      showToast('SYSTEM: INITIALIZING_HUB_ACCOUNT...', 'info');
      const [response] = await Promise.all([
        authService.register(email, password),
        new Promise(resolve => setTimeout(resolve, 1200))
      ]);
      const successMessage = response.message ? response.message.toUpperCase() : 'ACCOUNT_PROVISIONED';
      showToast(successMessage, 'success');
      return response;
    } catch (error) {
      showToast(error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onboard = async (onboardingData) => {
    setLoading(true);
    try {
      showToast('SYSTEM: SYNCING_USER_IDENTITY...', 'info');
      await Promise.all([
        userService.onboard(onboardingData),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      await loadProfile();
      showToast('PROFILE_IDENTITY_SYNCED', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    showToast('SESSION_ENDED: HUB_LOGOUT', 'warning');
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, initializing, login, register, onboard, logout }}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
