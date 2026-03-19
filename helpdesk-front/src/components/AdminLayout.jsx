import React, {useContext, useEffect} from 'react';
import {NavLink, Outlet, useLocation, useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { downloadLogs } from '../api/logs';
import NotificationBell from "./NotificationBell.jsx";

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/admin' || location.pathname === '/admin/') {
            navigate('/admin/users', { replace: true });
        }
    }, [location, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDownloadLogs = async () => {
        try {
            const response = await downloadLogs();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'system_logs.txt');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch(e) {
            alert('Ошибка скачивания логов');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            {/* Sidebar */}
            <div style={{
                width: '300px',
                background: 'linear-gradient(180deg, #212529 0%, #1a1e21 100%)',
                color: '#f8f9fa',
                padding: '28px 20px',
                boxShadow: '4px 0 15px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                    <div style={{ overflow: 'hidden' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Администратор</h3>
                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {user?.fullName}
                        </p>
                    </div>
                    <NotificationBell />
                </div>

                <hr style={{
                    border: 'none',
                    height: '1px',
                    background: 'rgba(255,255,255,0.1)',
                    margin: '5px 0 20px 0'
                }} />

                <nav style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    flex: '1'
                }}>
                    <NavLink
                        to="/admin/users"
                        style={({ isActive }) => ({
                            color: isActive ? '#fff' : '#adb5bd',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? '#0d6efd' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        })}
                    >
                        <span>👥</span> Пользователи
                    </NavLink>
                    <NavLink
                        to="/admin/categories"
                        style={({ isActive }) => ({
                            color: isActive ? '#fff' : '#adb5bd',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? '#0d6efd' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        })}
                    >
                        <span>📂</span> Категории
                    </NavLink>
                    <NavLink
                        to="/admin/reports"
                        style={({ isActive }) => ({
                            color: isActive ? '#fff' : '#adb5bd',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? '#0d6efd' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        })}
                    >
                        <span>📊</span> Отчеты
                    </NavLink>
                    <NavLink
                        to="/admin/profile"
                        style={({ isActive }) => ({
                            color: isActive ? '#fff' : '#adb5bd',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? '#0d6efd' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        })}
                    >
                        <span>⚙️</span> Профиль
                    </NavLink>
                    <NavLink
                        to="/admin/faq"
                        style={({ isActive }) => ({
                            color: isActive ? '#fff' : '#adb5bd',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? '#0d6efd' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        })}
                    >
                        <span>❓</span> FAQ
                    </NavLink>
                </nav>

                <hr style={{
                    border: 'none',
                    height: '1px',
                    background: 'rgba(255,255,255,0.1)',
                    margin: '20px 0'
                }} />

                <button
                    onClick={handleDownloadLogs}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#198754',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '12px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#157347'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#198754'}
                >
                    <span>📥</span> Скачать логи
                </button>

                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#bb2d3b'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                    Выйти
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                padding: '30px',
                background: '#f1f4f8',
                overflowY: 'auto'
            }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;