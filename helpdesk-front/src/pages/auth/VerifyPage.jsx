import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyCode, cancelSession } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const VerifyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { loginSuccess } = useContext(AuthContext);

    const sessionId = location.state?.sessionId;

    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleCancel = async () => {
        try {
            if (sessionId) await cancelSession(sessionId);
        } catch (e) {
            console.error("Ошибка отмены сессии");
        }
        navigate('/login');
    };

    if (!sessionId) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', padding: '20px' }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
                    <p style={{ color: '#111827' }}>Ошибка: сессия не найдена.</p>
                    <a href="/login" style={{ color: '#4F46E5' }}>Назад</a>
                </div>
            </div>
        );
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await verifyCode(sessionId, code);
            loginSuccess(response.data);

            const role = response.data.user.role;
            if (role === 'Admin') navigate('/admin');
            else if (role === 'Operator') navigate('/operator');
            else navigate('/client');

        } catch (err) {
            setError(err.response?.data?.error || 'Неверный код');
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
        marginTop: '4px',
        textAlign: 'center',
        letterSpacing: '2px'
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

    const btnSecondary = {
        width: '100%',
        padding: '12px',
        background: '#F3F4F6',
        color: '#374151',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        marginTop: '12px'
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginTop: 0, marginBottom: '8px', textAlign: 'center', fontSize: '24px', color: '#111827' }}>
                    Подтверждение кода
                </h2>
                <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '32px', fontSize: '14px' }}>
                    Код отправлен на вашу почту
                </p>

                <form onSubmit={handleVerify}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', textAlign: 'center' }}>
                            Введите код
                        </label>
                        <input
                            type="text"
                            placeholder="- - - -"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#B91C1C', background: '#FEF2F2', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" style={btnPrimary}>Подтвердить</button>
                    <button type="button" onClick={handleCancel} style={btnSecondary}>Отмена</button>
                </form>
            </div>
        </div>
    );
};

export default VerifyPage;