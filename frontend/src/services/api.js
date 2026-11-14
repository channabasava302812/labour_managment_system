import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

// Attach JWT token automatically if logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('labour_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Auth API
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);

// 2. Labour API (Screen 1)
export const fetchLabours = (params) => API.get('/labours', { params });
export const onboardLabour = (data) => API.post('/labours', data);
export const updateLabour = (id, data) => API.put(`/labours/${id}`, data);
export const deleteLabour = (id) => API.delete(`/labours/${id}`);

// 3. Attendance & Wage API (Screen 2)
export const fetchDailyAttendance = (date) => API.get('/labours/attendance/daily', { params: { date } });
export const logAttendance = (data) => API.post('/labours/attendance', data);

// 4. BFF Aggregator API
export const fetchBffSummary = (date) => API.get('/bff/summary', { params: { date } });

// 5. Python Chatbot API (via BFF Gateway)
export const sendChatMessage = (message) => API.post('/bff/chat', { message });

export default API;