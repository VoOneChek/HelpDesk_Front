import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { recoverPassword } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const RecoverResetPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { loginSuccess } = useContext(AuthContext);

    const sessionId = location.state?.sessionId;

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!sessionId) {
        return <p>Ошибка сессии. <a href="/recover">Начать заново</a></p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError("Пароль должен быть не менее 6 символов");
            return;
        }

        try {
            const response = await recoverPassword(sessionId, code, password);
            loginSuccess(response.data);

            // Редирект
            const role = response.data.user.role;
            if (role === 'Admin') navigate('/admin');
            else if (role === 'Operator') navigate('/operator');
            else navigate('/client');

        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка сброса пароля');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Сброс пароля</h2>
            <p>Введите код подтверждения и задайте новый пароль.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Код подтверждения"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                /><br/><br/>
                <input
                    type="password"
                    placeholder="Новый пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br/><br/>
                <button type="submit">Сохранить и войти</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default RecoverResetPage;