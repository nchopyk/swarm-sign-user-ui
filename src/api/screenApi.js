const accessToken = JSON.parse(
  localStorage.getItem('user-tokens')
)?.accessToken;
import api from '.';

api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

export const screenApi = {
  getAll: async (organizationId) => {
    try {
      const response = await api.get(
        `/organizations/${organizationId}/screens`
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred during get screens');
    }
  },
  add: async (name, organizationId) => {
    try {
      const response = await api.post(
        `/organizations/${organizationId}/screens`,
        {
          name: name,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error.response
        ? error.response.data
        : new Error('An error occurred during add screen');
    }
  },
  update: async (value, screenId, organizationId) => {
    try {
      const response = await api.patch(
        `/organizations/${organizationId}/screens/${screenId}`,
        value
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred during add screen');
    }
  },
  delete: async (screenId, organizationId) => {
    try {
      const response = await api.delete(
        `/organizations/${organizationId}/screens/${screenId}`
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred during add screen');
    }
  },
  activate: async (screenId, code, organizationId) => {
    try {
      const response = await api.post(
        `/organizations/${organizationId}/screens/${screenId}/activate`,
        {
          code,
        }
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred during add screen');
    }
  },

  deactivate: async (screenId, organizationId) => {
    try {
      const response = await api.post(
        `/organizations/${organizationId}/screens/${screenId}/deactivate`
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred during add screen');
    }
  },
};

export default screenApi;
