import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../api/tickets';
import { getAllCategories } from '../../api/categories';

const CreateTicketPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Загружаем категории для выпадающего списка
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories(res.data);
                if(res.data.length > 0) {
                    setCategoryId(res.data[0].id); // Выбираем первую по умолчанию
                }
            } catch(e) {
                console.error("Не удалось загрузить категории");
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!categoryId) {
            alert("Выберите категорию");
            return;
        }

        try {
            await createTicket({
                title,
                description,
                priority,
                categoryId
            });
            alert('Обращение создано!');
            navigate('/client/tickets');
        } catch (error) {
            alert(error.response?.data?.error || 'Ошибка создания');
        }
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <h2>Создать новое обращение</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Тема:</label><br />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Описание:</label><br />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="5"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Категория:</label><br />
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Приоритет:</label><br />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="Low">Низкий</option>
                        <option value="Medium">Средний</option>
                        <option value="High">Высокий</option>
                        <option value="Critical">Критический</option>
                    </select>
                </div>

                <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Отправить
                </button>
            </form>
        </div>
    );
};

export default CreateTicketPage;