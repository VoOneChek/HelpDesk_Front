import client from './client';

export const getMyTickets = (params) => {
    return client.get('/tickets/my', { params });
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