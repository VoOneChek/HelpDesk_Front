import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const OperatorDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();      // Чистим localStorage и state
        navigate('/login'); // 3. Делаем переход на страницу логина
    };

    return (
        <div>
            <h1>Панель оператора</h1>
            <p>Привет, {user?.fullName}!</p>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
};

export default OperatorDashboard;