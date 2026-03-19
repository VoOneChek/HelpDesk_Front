import client from './client';

export const getProfile = () => {
    return client.get('/users/profile');
};

export const updateProfile = (data) => {
    return client.put('/users/profile', data);
};

// --- Admin methods ---

export const getAllUsers = () => {
    return client.get('/users/all');
};

export const createUser = (userData) => {
    return client.post('/users/create', userData);
};

export const updateUser = (userId, userData) => {
    return client.put(`/users/${userId}/update`, userData);
};

export const toggleBlockUser = (userId) => {
    return client.put(`/users/${userId}/switchBlock`);
};