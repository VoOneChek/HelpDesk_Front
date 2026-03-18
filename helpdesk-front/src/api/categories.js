import client from './client';

export const getAllCategories = () => {
    return client.get('/categories');
};