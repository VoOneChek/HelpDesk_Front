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
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories(res.data);
                if(res.data.length > 0) {
                    setCategoryId(res.data[0].id);
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

    // --- Стили ---
    const pageStyle = {
        padding: '20px',
        background: '#F9FAFB',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        padding: '32px',
        width: '100%',
        maxWidth: '700px',
        marginTop: '40px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box',
        background: 'white',
        color: '#111827',
        colorScheme: 'light',
        transition: 'border-color 0.2s'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '120px',
        resize: 'vertical'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '6px'
    };

    const formGroupStyle = {
        marginBottom: '24px'
    };

    const btnPrimary = {
        padding: '12px 24px',
        background: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    };

    const btnSecondary = {
        padding: '12px 24px',
        background: '#F3F4F6',
        color: '#374151',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '24px', color: '#111827' }}>
                    Создать новое обращение
                </h2>
                <p style={{ marginTop: 0, marginBottom: '32px', fontSize: '14px', color: '#6B7280' }}>
                    Заполните форму ниже, чтобы отправить запрос в службу поддержки
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Тема</label>
                        <input
                            type="text"
                            placeholder="Кратко опишите суть проблемы"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Описание</label>
                        <textarea
                            placeholder="Подробно опишите вашу проблему..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            style={textareaStyle}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                        <div>
                            <label style={labelStyle}>Категория</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                style={inputStyle}
                            >
                                {categories.length === 0 && <option value="" disabled>Загрузка...</option>}
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Приоритет</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="Low">Низкий</option>
                                <option value="Medium">Средний</option>
                                <option value="High">Высокий</option>
                                <option value="Critical">Критический</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
                        <button type="button" onClick={() => navigate(-1)} style={btnSecondary}>
                            Отмена
                        </button>
                        <button type="submit" style={btnPrimary}>
                            Отправить обращение
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketPage;