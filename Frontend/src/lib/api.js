const DEFAULT_API_BASE = import.meta.env.DEV
  ? 'http://localhost:8080'
  : 'https://curd-api-chc6.onrender.com';

export const API_BASE = (import.meta.env.VITE_API_URL || DEFAULT_API_BASE).replace(/\/+$/, '');
