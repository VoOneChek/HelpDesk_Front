import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, toggleBlockUser } from '../../api/users';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // Если редактируем
    const [formData, setFormData] = useState({ email: '', password: '', fullName: '', role: 'Client' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (e) {
            alert('Ошибка загрузки пользователей');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ email: '', password: '', fullName: '', role: 'Client' });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({ email: user.email, fullName: user.fullName, role: user.role, password: '' }); // Пароль не меняем здесь
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Редактирование (без пароля)
                await updateUser(editingUser.id, { email: formData.email, fullName: formData.fullName, role: formData.role });
            } else {
                // Создание
                await createUser(formData);
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.error || 'Ошибка сохранения');
        }
    };

    const handleBlockToggle = async (user) => {
        try {
            const newStatus = !user.isBlocked;
            await toggleBlockUser(user.id, newStatus);
            fetchUsers();
        } catch(e) {
            alert('Ошибка изменения статуса');
        }
    };

    // --- Стили ---
    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        padding: '24px',
        marginBottom: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    };

    const btnPrimary = {
        padding: '10px 20px',
        background: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'background 0.2s'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box',
        marginTop: '4px',
        background: 'white',
        color: '#111827',
        colorScheme: 'light'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '6px'
    };

    if (loading) return <div style={{textAlign: 'center', padding: '50px', fontSize: '18px', color: '#6B7280'}}>Загрузка...</div>;

    return (
        <div style={{ padding: '20px', background: '#F9FAFB', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Пользователи</h2>
                <button onClick={openCreateModal} style={btnPrimary}>
                    + Создать пользователя
                </button>
            </div>

            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                        <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>ФИО</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Роль</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Статус</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.2s' }}>
                                <td style={{ padding: '16px', fontWeight: '500', color: '#111827' }}>{u.fullName}</td>
                                <td style={{ padding: '16px', color: '#4B5563' }}>{u.email}</td>
                                <td style={{ padding: '16px' }}>
                                        <span style={{
                                            background: '#EEF2FF',
                                            color: '#4F46E5',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}>
                                            {u.role}
                                        </span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: u.isBlocked ? '#FEF2F2' : '#F0FDF4',
                                            color: u.isBlocked ? '#B91C1C' : '#15803D',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            <span style={{ height: '6px', width: '6px', borderRadius: '50%', background: u.isBlocked ? '#B91C1C' : '#15803D' }}></span>
                                            {u.isBlocked ? 'Заблокирован' : 'Активен'}
                                        </span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => openEditModal(u)}
                                        style={{
                                            marginRight: '8px',
                                            background: '#F3F4F6',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            color: '#374151'
                                        }}>
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => handleBlockToggle(u)}
                                        style={{
                                            background: u.isBlocked ? '#D1FAE5' : '#FEE2E2',
                                            color: u.isBlocked ? '#065F46' : '#991B1B',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}>
                                        {u.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Модальное окно */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(17, 24, 39, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '32px',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '450px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ marginTop: 0, color: '#111827', fontSize: '20px' }}>
                            {editingUser ? 'Редактирование' : 'Создание'} пользователя
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>ФИО</label>
                                <input name="fullName" value={formData.fullName} onChange={handleInputChange} required style={inputStyle} placeholder="Иванов Иван Иванович" />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleInputChange} required style={inputStyle} placeholder="mail@example.com" />
                            </div>

                            {!editingUser && (
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={labelStyle}>Пароль</label>
                                    <input name="password" type="password" value={formData.password} onChange={handleInputChange} required style={inputStyle} placeholder="Минимум 6 символов" />
                                </div>
                            )}

                            <div style={{ marginBottom: '24px' }}>
                                <label style={labelStyle}>Роль</label>
                                <select name="role" value={formData.role} onChange={handleInputChange} style={{...inputStyle, background: 'white'}}>
                                    <option value="Client">Клиент</option>
                                    <option value="Operator">Оператор</option>
                                    <option value="Admin">Администратор</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{
                                    padding: '10px 20px',
                                    background: '#F3F4F6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Отмена
                                </button>
                                <button type="submit" style={btnPrimary}>
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;