import apiClient from './api';
import { User } from '../types';

export const authService = {
  // Exchange Google OAuth token for our app's JWT token
  loginWithGoogle: async (googleToken: string) => {
    const response = await apiClient.post('/api/auth/google', { token: googleToken });
    const { token, user } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    return user as User;
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/users/me');
    return response.data as User;
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};