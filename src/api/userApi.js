import api from '.';

export const userApi = {
  login: async (email, password) => {
    try {
      return await api.post('/users/login', { email, password });
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred during login');
    }
  },

  register: async (userData) => {
    try {
      return await api.post('/users/sign-up', userData);
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred during registration');
    }
  },

  getUserInfo: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred while fetching user profile');
    }
  },
};

export default userApi;
