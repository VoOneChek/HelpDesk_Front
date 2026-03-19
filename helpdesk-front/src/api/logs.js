import client from './client';

export const downloadLogs = () => {
    return client.get('/logs/download', { responseType: 'blob' });
};