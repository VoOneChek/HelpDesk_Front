import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../api/users';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Загружаем актуальные данные с сервера
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                setFullName(res.data.fullName);
            } catch (e) {
                console.error("Ошибка загрузки профиля");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await updateProfile({ fullName });
            // Обновляем данные в локальном хранилище
            const updatedUser = { ...user, fullName };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // В идеале нужно обновить состояние AuthContext, но пока просто алерт
            setMessage('Данные успешно обновлены!');
        } catch (e) {
            setMessage('Ошибка при обновлении');
        }
    };

    if (loading) return <p>Загрузка...</p>;

    return (
        <div style={{ maxWidth: '400px' }}>
            <h2>Мой профиль</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label><br />
                    <input type="email" value={user?.email || ''} disabled style={{ background: '#eee', width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>ФИО:</label><br />
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit">Сохранить изменения</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default ProfilePage;