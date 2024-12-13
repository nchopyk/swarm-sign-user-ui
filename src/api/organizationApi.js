import api from '.';


const accessToken = localStorage.getItem('user-tokens') ? JSON.parse(localStorage.getItem('user-tokens'))?.accessToken : null;


export const organizationApi = {
  getUserOrganization: async (token = accessToken) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await api.get(`/users/me/organizations`);
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred during login');
    }
  },
};

export default organizationApi;
