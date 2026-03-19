import client from './client';

export const getMyTickets = (params) => {
    return client.get('/tickets/my', { params });
};

export const getAllTickets = (params) => {
    return client.get('/tickets/all', { params });
};

export const getTicketDetails = (id) => {
    return client.get(`/tickets/${id}`);
};

export const createTicket = (data) => {
    return client.post('/tickets', data);
};

export const addComment = (ticketId, content) => {
    return client.post(`/tickets/${ticketId}/comments`, { content });
};

export const getTicketHistory = (ticketId) => {
    return client.get(`/tickets/${ticketId}/history`);
};

export const assignTicket = (ticketId) => {
    return client.put(`/tickets/${ticketId}/assign`);
};

export const changeTicketStatus = (ticketId, status) => {
    // Бэкенд ожидает просто Enum строку в теле
    return client.put(`/tickets/${ticketId}/status`, JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const getOperatorStats = () => {
    return client.get('/tickets/stats');
};