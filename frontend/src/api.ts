import axios from 'axios';

// Backend base URL. Set VITE_API_URL in Vercel (e.g. https://smart-civic-api.onrender.com).
// Falls back to localhost for local development.
export const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/$/, '');

// Configure the shared axios singleton so every `axios.get('/api/...')`
// call is routed to the backend regardless of environment.
axios.defaults.baseURL = API_BASE;

export default axios;