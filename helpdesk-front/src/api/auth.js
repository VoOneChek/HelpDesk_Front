import client from './client';

export const login = (email, password) => {
    return client.post('/auth/login', { email, password });
};

export const verifyCode = (sessionId, code) => {
    return client.post('/auth/verify-code', { sessionId, code });
};

export const register = (email, password, fullName) => {
    return client.post('/auth/register', { email, password, fullName });
};

export const cancelSession = (sessionId) => {
    return client.post('/auth/cancel-session', sessionId, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const recoverLogin = (fullName) => {
    return client.post('/auth/recover-login', { fullName: fullName });
};

export const recoverPassword = (sessionId, code, password) => {
    return client.post('/auth/recover-password', {
        sessionId: sessionId,
        code: code,
        password: password
    });
};