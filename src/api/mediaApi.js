import api from '.';

const accessToken = localStorage.getItem('user-tokens') ? JSON.parse(localStorage.getItem('user-tokens'))?.accessToken : null;

api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

export const mediaApi = {
  getAll: async (organizationId) => {
    try {
      const response = await api.get(`/organizations/${organizationId}/medias`);
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while getting media files');
    }
  },

  add: async (mediaFile, name, type, organizationId) => {
    try {
      const formData = new FormData();
      formData.append('mediaFile', mediaFile);
      formData.append('name', name);
      formData.append('type', type);

      const response = await api.post(
        `/organizations/${organizationId}/medias`,
        formData
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while adding media');
    }
  },

  update: async (mediaFile, mediaId, type, name, organizationId) => {
    try {
      const formData = new FormData();

      if (mediaFile) {
        formData.append('mediaFile', mediaFile);
      }

      if (name) {
        formData.append('name', name);
      }

      if (mediaFile && type) {
        formData.append('type', type);
      }

      return await api.patch(`/organizations/${organizationId}/medias/${mediaId}`, formData);
    } catch (error) {
      throw error.response ? error.response.data : new Error('An error occurred while updating media');
    }
  },

  delete: async (mediaId, organizationId) => {
    try {
      const response = await api.delete(
        `/organizations/${organizationId}/medias/${mediaId}`
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while deleting media');
    }
  },
};

export default mediaApi;
