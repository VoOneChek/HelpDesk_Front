import React, { useContext, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from "./NotificationBell.jsx";

const ClientLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/client' || location.pathname === '/client/') {
            navigate('/client/tickets', { replace: true });
        }
    }, [location, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                background: 'linear-gradient(180deg, #2c3e50 0%, #1a252f 100%)',
                color: '#ecf0f1',
                padding: '28px 20px',
                boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                    <div style={{ overflow: 'hidden' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Клиент</h3>
                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {user?.fullName}
                        </p>
                    </div>
                    <NotificationBell />
                </div>

                <hr style={{
                    border: 'none',
                    height: '1px',
                    background: 'rgba(255,255,255,0.2)',
                    margin: '5px 0 20px 0'
                }} />

                <nav style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    flex: '1'
                }}>
                    <NavLink
                        to="/client/tickets"
                        style={({ isActive }) => ({
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? 'rgba(52, 152, 219, 0.8)' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        })}
                    >
                        <span>📋</span> Мои обращения
                    </NavLink>

                    <NavLink
                        to="/client/faq"
                        style={({ isActive }) => ({
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? 'rgba(52, 152, 219, 0.8)' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        })}
                    >
                        <span>❓</span> Помощь
                    </NavLink>

                    <NavLink
                        to="/client/profile"
                        style={({ isActive }) => ({
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? 'rgba(52, 152, 219, 0.8)' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        })}
                    >
                        <span>👤</span> Мой профиль
                    </NavLink>
                </nav>

                <hr style={{
                    border: 'none',
                    height: '1px',
                    background: 'rgba(255,255,255,0.2)',
                    margin: '20px 0'
                }} />

                <button
                    onClick={handleLogout}
                    style={{
                        marginTop: '10px',
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(231, 76, 60, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.8)'}
                >
                    Выйти
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                padding: '30px',
                backgroundColor: '#f8fafc',
                overflowY: 'auto'
            }}>
                <Outlet />
            </div>
        </div>
    );
};

export default ClientLayout;