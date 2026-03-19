import client from './client';

export const getFaqs = () => client.get('/faq');
export const createFaq = (data) => client.post('/faq', data);
export const updateFaq = (id, data) => client.put(`/faq/${id}`, data);
export const deleteFaq = (id) => client.delete(`/faq/${id}`);