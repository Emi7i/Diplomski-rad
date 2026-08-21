import apiClient from '@lib/api-client';
import type { LoginFormData } from '@lib/schemas';

// Mock mode for development without backend
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH !== 'false';

// Mock user database
const mockUsers = [
  { email: 'test@example.com', password: 'password123' },
  { email: 'admin@example.com', password: 'admin123' },
];

export const authService = {
  async login(credentials: LoginFormData) {
    if (USE_MOCK) {
      // Mock login implementation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      const user = mockUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Generate a fake token
      const token = btoa(`${user.email}:${Date.now()}`);

      return {
        token,
        user: { email: user.email },
      };
    }

    // Real API login
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async logout() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      return;
    }

    await apiClient.post('/auth/logout');
  },
};
