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

    return (
        <div style={{ padding: 20 }}>
            <h2>Восстановление доступа</h2>
            <p>Введите ваш логин, указанный при регистрации</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                /><br/><br/>
                <button type="submit">Найти</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p><a href="/login">Назад ко входу</a></p>
        </div>
    );
};

export default RecoverPage;