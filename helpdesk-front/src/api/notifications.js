import client from './client';

export const getNotifications = () => {
    return client.get('/notifications');
};

export const markNotificationRead = (id) => {
    return client.put(`/notifications/${id}/read`);
};