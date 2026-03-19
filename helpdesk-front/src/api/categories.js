import client from './client';

export const getAllCategories = () => {
    return client.get('/categories');
};

export const createCategory = (data) => {
    return client.post('/categories', data);
};

export const updateCategory = (id, data) => {
    return client.put(`/categories/${id}`, data);
};

export const deleteCategory = (id) => {
    return client.delete(`/categories/${id}`);
};