import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ClientLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#f0f0f0', padding: '20px', borderRight: '1px solid #ccc' }}>
                <h3>Клиент</h3>
                <p>{user?.fullName}</p>
                <hr />
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <NavLink to="/client/tickets" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                        Мои обращения
                    </NavLink>
                    <NavLink to="/client/profile" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                        Мой профиль
                    </NavLink>
                </nav>
                <hr />
                <button onClick={handleLogout} style={{ marginTop: '20px', width: '100%' }}>
                    Выйти
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px' }}>
                <Outlet /> {/* Здесь будут рендериться дочерние страницы */}
            </div>
        </div>
    );
};

export default ClientLayout;