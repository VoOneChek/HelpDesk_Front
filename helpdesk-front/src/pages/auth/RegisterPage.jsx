import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');

    const { loginSuccess } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(email, password, fullName);
            loginSuccess(response.data);

            const role = response.data.user.role;
            if (role === 'Admin') navigate('/admin');
            else if (role === 'Operator') navigate('/operator');
            else navigate('/client');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
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

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '4px'
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
                    Регистрация
                </h2>
                <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '32px', fontSize: '14px' }}>
                    Создайте новый аккаунт
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>ФИО</label>
                        <input
                            placeholder="Иванов Иван Иванович"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Email</label>
                        <input
                            type="email"
                            placeholder="mail@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Пароль</label>
                        <input
                            type="password"
                            placeholder="Минимум 6 символов"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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
                        Зарегистрироваться
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Уже есть аккаунт? </span>
                    <a href="/login" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
                        Войти
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;