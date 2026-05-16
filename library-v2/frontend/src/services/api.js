import axios from 'axios';

const api = axios.create({ baseURL: 'https://grantha-v2-1.onrender.com/', timeout: 10000, headers: { 'Content-Type': 'application/json' } });

export const getDashboard = () => api.get('/dashboard');
export const getAnalytics = () => api.get('/analytics');
export const globalSearch = (q) => api.get('/search', { params: { q } });

export const getBooks = (p) => api.get('/books', { params: p });
export const getBook = (id) => api.get(`/books/${id}`);
export const addBook = (d) => api.post('/books', d);
export const updateBook = (id, d) => api.put(`/books/${id}`, d);
export const deleteBook = (id) => api.delete(`/books/${id}`);
export const getGenres = () => api.get('/genres');

export const getMembers = (p) => api.get('/members', { params: p });
export const getMember = (id) => api.get(`/members/${id}`);
export const addMember = (d) => api.post('/members', d);
export const updateMember = (id, d) => api.put(`/members/${id}`, d);
export const deleteMember = (id) => api.delete(`/members/${id}`);

export const getTransactions = (p) => api.get('/transactions', { params: p });
export const issueBook = (d) => api.post('/transactions/issue', d);
export const returnBook = (id) => api.post(`/transactions/return/${id}`);
export const renewBook = (id) => api.post(`/transactions/renew/${id}`);

export const getReservations = () => api.get('/reservations');
export const addReservation = (d) => api.post('/reservations', d);
export const cancelReservation = (id) => api.delete(`/reservations/${id}`);

export const getFines = () => api.get('/fines');
export const payFine = (txnId) => api.post(`/fines/pay/${txnId}`);

export const getNotifications = () => api.get('/notifications');
export const markAllRead = () => api.put('/notifications/read-all');

export default api;
