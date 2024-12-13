import axios from 'axios';

const serverHost = import.meta.env.VITE_SERVER_HOST;

const api = axios.create({
  baseURL: `${serverHost}/v1`,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.setItem('user', null);
      localStorage.setItem('user-tokens', null);
      window.location = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
