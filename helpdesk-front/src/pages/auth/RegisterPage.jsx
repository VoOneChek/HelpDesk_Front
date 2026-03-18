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

    return (
        <div style={{ padding: 20 }}>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="ФИО" value={fullName} onChange={e => setFullName(e.target.value)} required /><br/><br/>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br/><br/>
                <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required /><br/><br/>
                <button type="submit">Зарегистрироваться</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default RegisterPage;