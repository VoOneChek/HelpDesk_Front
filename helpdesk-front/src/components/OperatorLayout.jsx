import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { RefreshContext } from '../context/RefreshContext.jsx';
import { AuthContext } from '../context/AuthContext';
import { getOperatorStats } from '../api/tickets';
import NotificationBell from "./NotificationBell.jsx";

const OperatorLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const { refreshKey } = useContext(RefreshContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);

    // Загружаем статистику для виджета в сайдбаре
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getOperatorStats();
                setStats(res.data);
            } catch(e) {
                console.error("Не удалось загрузить статистику");
            }
        };
        fetchStats();
    }, [refreshKey]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            {/* Sidebar */}
            <div style={{
                width: '300px',
                background: 'linear-gradient(180deg, #0d6efd 0%, #0b5ed7 100%)',
                color: 'white',
                padding: '28px 20px',
                boxShadow: '2px 0 15px rgba(13, 110, 253, 0.2)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                    <div style={{ overflow: 'hidden' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Оператор</h3>
                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {user?.fullName}
                        </p>
                    </div>
                    <NotificationBell />
                </div>

                {/* Виджет статистики */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '25px',
                    fontSize: '14px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <p style={{
                        margin: '0 0 12px 0',
                        fontSize: '15px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span>📊</span> Моя статистика:
                    </p>
                    {stats ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '6px 8px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '6px'
                            }}>
                                <span>В работе:</span>
                                <span style={{ fontWeight: '700', fontSize: '18px' }}>{stats.totalAssigned}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '6px 8px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '6px'
                            }}>
                                <span>Закрыто сегодня:</span>
                                <span style={{ fontWeight: '700', fontSize: '18px', color: '#4cd964' }}>{stats.closedToday}</span>
                            </div>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', opacity: '0.8', margin: '10px 0' }}>
                            Загрузка...
                        </p>
                    )}
                </div>

                <nav style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    flex: '1'
                }}>
                    <NavLink
                        to="/operator/tickets"
                        style={({ isActive }) => ({
                            color: 'white',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        })}
                    >
                        <span>🎫</span> Все обращения
                    </NavLink>
                    <NavLink
                        to="/operator/faq"
                        style={({ isActive }) => ({
                            color: 'white',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        })}
                    >
                        <span>❓</span> Помощь
                    </NavLink>
                    <NavLink
                        to="/operator/profile"
                        style={({ isActive }) => ({
                            color: 'white',
                            fontWeight: isActive ? '600' : '400',
                            textDecoration: 'none',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        })}
                    >
                        <span>⚙️</span> Мой профиль
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
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'rgba(220, 53, 69, 0.9)',
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
                    onMouseOver={(e) => e.target.style.backgroundColor = '#bb2d3b'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(220, 53, 69, 0.9)'}
                >
                    Выйти
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                padding: '30px',
                background: '#f8f9fa',
                overflowY: 'auto'
            }}>
                <Outlet />
            </div>
        </div>
    );
};

export default OperatorLayout;