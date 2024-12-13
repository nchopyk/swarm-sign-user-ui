import api from '.';

const accessToken = JSON.parse(
  localStorage.getItem('user-tokens')
)?.accessToken;

api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

export const playlistApi = {
  getAll: async (organizationId) => {
    try {
      const response = await api.get(
        `/organizations/${organizationId}/playlists`
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while getting playlists');
    }
  },

  getPlaylistMedias: async (playlistId, organizationId) => {
    try {
      const response = await api.get(
        `/organizations/${organizationId}/playlists/${playlistId}/medias`
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while getting playlist medias');
    }
  },

  add: async (name, medias, organizationId) => {
    try {
      const response = await api.post(
        `/organizations/${organizationId}/playlists`,
        {
          name,
          medias,
        }
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while adding playlist');
    }
  },

  update: async (playlistId, name, organizationId) => {
    try {
      const response = await api.patch(
        `/organizations/${organizationId}/playlists/${playlistId}`,
        { name }
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while updating playlist');
    }
  },

  delete: async (playlistId, organizationId) => {
    try {
      if (!organizationId) {
        return res.status(401).json({
          message: 'Unauthorized access. Please provide a valid token.',
        });
      }
      const response = await api.delete(
        `/organizations/${organizationId}/playlists/${playlistId}`
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while deleting playlist');
    }
  },

  addMedias: async (playlistId, medias, organizationId) => {
    try {
      if (!organizationId) {
        return res.status(401).json({
          message: 'Unauthorized access. Please provide a valid token.',
        });
      }
      const response = await api.post(
        `/organizations/${organizationId}/playlists/${playlistId}/medias/add`,
        { medias }
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while adding medias to playlist');
    }
  },

  removeMedias: async (playlistId, playlistMedias, organizationId) => {
    try {
      if (!organizationId) {
        return res.status(401).json({
          message: 'Unauthorized access. Please provide a valid token.',
        });
      }
      const response = await api.post(
        `/organizations/${organizationId}/playlists/${playlistId}/medias/remove`,
        { playlistMedias }
      );
      return response;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('An error occurred while removing medias from playlist');
    }
  },
};

export default playlistApi;
