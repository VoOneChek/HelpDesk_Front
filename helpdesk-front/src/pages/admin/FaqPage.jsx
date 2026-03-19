import React, { useState, useEffect } from 'react';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../../api/faq';

const FaqPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        const res = await getFaqs();
        setFaqs(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateFaq(editingId, formData);
            } else {
                await createFaq(formData);
            }
            setFormData({ title: '', content: '' });
            setEditingId(null);
            fetchFaqs();
        } catch (e) {
            alert('Ошибка сохранения');
        }
    };

    const handleEdit = (faq) => {
        setEditingId(faq.id);
        setFormData({ title: faq.title, content: faq.content });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить статью базы знаний?')) {
            await deleteFaq(id);
            fetchFaqs();
        }
    };

    // --- Стили (скопированы из CategoriesPage для единства стиля) ---
    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginBottom: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
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
        colorScheme: 'light'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '100px',
        resize: 'vertical'
    };

    const btnPrimary = {
        padding: '10px 20px',
        background: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    };

    const btnSecondary = {
        padding: '10px 20px',
        background: '#F3F4F6',
        color: '#374151',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    };

    return (
        <div style={{ padding: '20px', background: '#F9FAFB', minHeight: '100vh' }}>
            <h2 style={{ marginTop: 0, fontSize: '24px', color: '#111827', marginBottom: '24px' }}>База знаний (FAQ)</h2>

            {/* Форма добавления/редактирования */}
            <div style={cardStyle}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', color: '#374151' }}>
                    {editingId ? 'Редактировать статью' : 'Новая статья'}
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Вопрос (Заголовок)</label>
                        <input
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                            placeholder="Тема вопроса"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Ответ (Содержание)</label>
                        <textarea
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                            required
                            placeholder="Развернутый ответ..."
                            style={textareaStyle}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{...btnPrimary, background: editingId ? '#F59E0B' : '#4F46E5'}}>
                            {editingId ? 'Обновить' : 'Опубликовать'}
                        </button>
                        {editingId &&
                            <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', content: '' }); }} style={btnSecondary}>
                                Отмена
                            </button>
                        }
                    </div>
                </form>
            </div>

            {/* Список статей */}
            <div style={{ ...cardStyle, padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                        <thead>
                        <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', width: '25%' }}>Вопрос</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Ответ</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', width: '150px' }}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {faqs.map(faq => (
                            <tr key={faq.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '16px', fontWeight: '600', color: '#111827', verticalAlign: 'top' }}>{faq.title}</td>
                                {/* Отображаем контент. Если он длинный, можно обрезать или оставить как есть */}
                                <td style={{ padding: '16px', color: '#4B5563', whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                                    {faq.content}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', verticalAlign: 'top' }}>
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        style={{
                                            marginRight: '8px',
                                            background: '#EEF2FF',
                                            color: '#4F46E5',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}>
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        style={{
                                            background: '#FEF2F2',
                                            color: '#DC2626',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}>
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FaqPage;