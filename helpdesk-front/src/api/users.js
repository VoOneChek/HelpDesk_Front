import client from './client';

export const getProfile = () => {
    return client.get('/users/profile');
};

export const updateProfile = (data) => {
    return client.put('/users/profile', data);
};