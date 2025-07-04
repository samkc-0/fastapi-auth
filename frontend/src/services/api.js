import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const login = async (username, password) => {
  const response = await api.post('/auth/token', new URLSearchParams({
    username,
    password,
  }));
  return response.data;
};

export const getMe = async (token) => {
  const response = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
