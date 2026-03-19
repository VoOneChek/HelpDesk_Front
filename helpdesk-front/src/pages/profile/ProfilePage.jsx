import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../api/users';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                setFullName(res.data.fullName);
            } catch (e) {
                console.error("Ошибка загрузки профиля");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await updateProfile({ fullName });
            const updatedUser = { ...user, fullName };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setMessage('Данные успешно обновлены!');
        } catch (e) {
            setMessage('Ошибка при обновлении');
        }
    };

    // --- Стили ---
    const pageStyle = {
        padding: '20px',
        background: '#F9FAFB',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        padding: '32px',
        width: '100%',
        maxWidth: '480px',
        marginTop: '40px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box',
        background: 'white',
        color: '#111827',
        transition: 'border-color 0.2s'
    };

    const disabledInputStyle = {
        ...inputStyle,
        background: '#F3F4F6',
        color: '#9CA3AF',
        cursor: 'not-allowed',
        borderColor: '#E5E7EB'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '6px'
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
        marginTop: '10px',
        transition: 'background 0.2s'
    };

    const successMessageStyle = {
        marginTop: '20px',
        padding: '12px',
        background: '#ECFDF5',
        color: '#065F46',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500',
        border: '1px solid #D1FAE5'
    };

    const errorMessageStyle = {
        marginTop: '20px',
        padding: '12px',
        background: '#FEF2F2',
        color: '#991B1B',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500',
        border: '1px solid #FEE2E2'
    };

    if (loading) return (
        <div style={{...pageStyle, alignItems: 'center'}}>
            <p style={{ color: '#6B7280' }}>Загрузка...</p>
        </div>
    );

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '24px', color: '#111827' }}>
                    Мой профиль
                </h2>
                <p style={{ marginTop: 0, marginBottom: '24px', fontSize: '14px', color: '#6B7280' }}>
                    Здесь вы можете изменить ваше имя
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Email</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            style={disabledInputStyle}
                        />
                        <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px', marginBottom: 0 }}>
                            Email нельзя изменить
                        </p>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>ФИО</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            style={inputStyle}
                            placeholder="Иванов Иван Иванович"
                        />
                    </div>

                    <button type="submit" style={btnPrimary}>
                        Сохранить изменения
                    </button>
                </form>

                {message && (
                    <div style={message.includes('успешно') ? successMessageStyle : errorMessageStyle}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;