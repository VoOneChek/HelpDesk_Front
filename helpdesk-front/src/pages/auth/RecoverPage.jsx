import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recoverLogin } from '../../api/auth';

const RecoverPage = () => {
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await recoverLogin(fullName);
            navigate('/recover/reset', { state: { sessionId: response.data.sessionId } });
        } catch (err) {
            setError(err.response?.data?.error || 'Пользователь не найден');
        }
    };

    // --- Стили ---
    const pageStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F9FAFB',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        padding: '40px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box',
        marginTop: '4px'
    };

    const btnPrimary = {
        width: '100%',
        padding: '12px',
        background: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        marginTop: '24px'
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginTop: 0, marginBottom: '8px', textAlign: 'center', fontSize: '24px', color: '#111827' }}>
                    Восстановление доступа
                </h2>
                <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '32px', fontSize: '14px' }}>
                    Введите ваш логин, указанный при регистрации
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <input
                            type="text"
                            placeholder="Логин"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#B91C1C', background: '#FEF2F2', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" style={btnPrimary}>
                        Найти
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <a href="/login" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
                        Назад ко входу
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RecoverPage;