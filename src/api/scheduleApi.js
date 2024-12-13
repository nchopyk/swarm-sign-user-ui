import api from '.';

const accessToken = JSON.parse(
  localStorage.getItem('user-tokens')
)?.accessToken;

api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

export const scheduleApi = {
  getAll: async (organizationId) => {
    try {
      const response = await api.get(
        `/organizations/${organizationId}/schedules`
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while getting schedules');
    }
  },

  add: async (name, playlistId, screenId, organizationId, start, end) => {
    try {
      const response = await api.post(
        `/organizations/${organizationId}/schedules`,
        {
          name,
          playlistId,
          screenId,
          start,
          end,
        }
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while adding schedule');
    }
  },

  update: async (scheduleId, name, organizationId) => {
    try {
      const response = await api.patch(
        `/organizations/${organizationId}/schedules/${scheduleId}`,
        { name }
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while updating schedule');
    }
  },

  delete: async (scheduleId, organizationId) => {
    try {
      const response = await api.delete(
        `/organizations/${organizationId}/schedules/${scheduleId}`
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while deleting schedule');
    }
  },
};

export default scheduleApi;
