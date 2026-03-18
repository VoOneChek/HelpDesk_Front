import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyCode } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const VerifyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { loginSuccess } = useContext(AuthContext);

    const sessionId = location.state?.sessionId;

    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    if (!sessionId) {
        return <p>Ошибка: сессия не найдена. <a href="/login">Назад</a></p>;
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

    return (
        <div style={{ padding: 20 }}>
            <h2>Подтверждение кода</h2>
            <p>Код отправлен на почту</p>
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    placeholder="Введите код"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                /><br/><br/>
                <button type="submit">Подтвердить</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default VerifyPage;