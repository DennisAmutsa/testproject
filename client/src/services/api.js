import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://northstar-server-pmf6.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Orders
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);
export const getOrdersByEmail = (email) => api.get(`/orders/email/${email}`);
export const seedOrders = () => api.post('/orders/seed');

// Returns
export const getReturnPolicy = () => api.get('/returns/policy');
export const getReturnById = (returnId) => api.get(`/returns/${returnId}`);
export const getReturnsByEmail = (email) => api.get(`/returns/email/${email}`);
export const createReturn = (data) => api.post('/returns', data);

// Stock
export const searchProducts = (query, category) =>
  api.get('/stock/search', { params: { query, category } });
export const getProductStock = (productId) => api.get(`/stock/${productId}`);
export const seedProducts = () => api.post('/stock/seed');
export const subscribeRestockAlert = (productId, email) =>
  api.post(`/stock/${productId}/notify`, { email });


// Help
export const getHelpTopics = () => api.get('/help/topics');
export const searchHelp = (q) => api.get('/help/search', { params: { q } });

export default api;
