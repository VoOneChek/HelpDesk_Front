import React, { useState, useEffect, useContext } from 'react';
import { getNotifications, markNotificationRead } from '../api/notifications';
import { AuthContext } from '../context/AuthContext';

const NotificationBell = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (user) fetch();
        const interval = setInterval(() => { if (user) fetch(); }, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const fetch = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data);
        } catch (e) { console.error("Ошибка загрузки уведомлений", e); }
    };

    const handleReadOne = async (id) => {
        try {
            await markNotificationRead(id);
            fetch();
        } catch (e) { console.error("Ошибка прочтения", e); }
    };

    const handleReadAll = async () => {
        const unread = notifications.filter(n => !n.isRead);
        for (const n of unread) {
            await markNotificationRead(n.id);
        }
        fetch();
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // --- Стили ---
    const wrapperStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    };

    const bellBtnStyle = {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        padding: '8px',
        borderRadius: '50%',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const badgeStyle = {
        position: 'absolute',
        top: '2px',
        right: '2px',
        background: '#EF4444',
        color: 'white',
        borderRadius: '9999px',
        padding: '0 6px',
        fontSize: '11px',
        fontWeight: 'bold',
        height: '18px',
        lineHeight: '18px',
        border: '2px solid white'
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '100%',
        left: 0, // Привязка к левому краю кнопки (чтобы не уходил за экран влево)
        minWidth: '300px', // Минимальная ширина
        width: 'max-content', // Ширина по контенту (но ограничена max-width)
        maxWidth: '90vw', // Чтобы не вылезал за правый край экрана на мобильных
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E5E7EB',
        zIndex: 9999,
        marginTop: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    const headerStyle = {
        padding: '12px 16px',
        borderBottom: '1px solid #F3F4F6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#F9FAFB'
    };

    const listStyle = {
        maxHeight: '350px',
        overflowY: 'auto',
        minWidth: '100%'
    };

    const itemStyle = (isRead) => ({
        padding: '12px 16px',
        borderBottom: '1px solid #F3F4F6',
        background: isRead ? '#FFFFFF' : '#F0F9FF',
        transition: 'background 0.2s',
        display: 'flex',
        gap: '10px'
    });

    const emptyStyle = {
        padding: '24px',
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: '14px'
    };

    return (
        <div style={wrapperStyle}>
            <button
                onClick={() => setOpen(!open)}
                style={bellBtnStyle}
                title="Уведомления"
            >
                <span style={{ fontSize: '22px', color: 'white' }}>🔔</span>
                {unreadCount > 0 && (
                    <span style={badgeStyle}>{unreadCount}</span>
                )}
            </button>

            {open && (
                <div style={dropdownStyle}>
                    <div style={headerStyle}>
                        <h3 style={{ margin: 0, fontSize: '15px', color: '#111827', fontWeight: '600' }}>Уведомления</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleReadAll}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#4F46E5',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                Прочитать все
                            </button>
                        )}
                    </div>

                    <div style={listStyle}>
                        {notifications.length === 0 ? (
                            <div style={emptyStyle}>
                                Нет новых уведомлений
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} style={itemStyle(n.isRead)}>
                                    <div style={{ marginTop: '2px', fontSize: '10px' }}>
                                        {n.isRead
                                            ? <span style={{color: '#D1D5DB'}}>⚪</span>
                                            : <span style={{color: '#3B82F6'}}>🔵</span>
                                        }
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#374151', lineHeight: 1.4 }}>
                                            {n.message}
                                        </p>
                                        <span style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
                                            {new Date(n.createdAt).toLocaleString('ru-RU')}
                                        </span>
                                    </div>

                                    {!n.isRead && (
                                        <button
                                            onClick={() => handleReadOne(n.id)}
                                            style={{
                                                background: '#EEF2FF',
                                                color: '#4F46E5',
                                                border: 'none',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                height: 'fit-content',
                                                whiteSpace: 'nowrap',
                                                alignSelf: 'center'
                                            }}
                                        >
                                            Ок
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;