import React, { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await getAllCategories();
        setCategories(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateCategory(editingId, formData);
            } else {
                await createCategory(formData);
            }
            setFormData({ name: '', description: '' });
            setEditingId(null);
            fetchCategories();
        } catch (e) {
            alert('Ошибка сохранения');
        }
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setFormData({ name: cat.name, description: cat.description });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить категорию? Тикеты в этой категории будут удалены.')) {
            await deleteCategory(id);
            fetchCategories();
        }
    };

    // --- Стили ---
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
            <h2 style={{ marginTop: 0, fontSize: '24px', color: '#111827', marginBottom: '24px' }}>Категории</h2>

            {/* Форма добавления/редактирования */}
            <div style={cardStyle}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', color: '#374151' }}>
                    {editingId ? 'Редактировать категорию' : 'Новая категория'}
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto auto', gap: '16px', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Название</label>
                        <input
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            required
                            placeholder="Название категории"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Описание</label>
                        <input
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Краткое описание"
                            style={inputStyle}
                        />
                    </div>
                    <button type="submit" style={{...btnPrimary, background: editingId ? '#F59E0B' : '#4F46E5'}}>
                        {editingId ? 'Обновить' : 'Создать'}
                    </button>
                    {editingId &&
                        <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', description: '' }); }} style={btnSecondary}>
                            Отмена
                        </button>
                    }
                </form>
            </div>

            {/* Список */}
            <div style={{ ...cardStyle, padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                        <thead>
                        <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Название</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Описание</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '16px', fontWeight: '600', color: '#111827' }}>{cat.name}</td>
                                <td style={{ padding: '16px', color: '#6B7280' }}>{cat.description || '—'}</td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleEdit(cat)}
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
                                        onClick={() => handleDelete(cat.id)}
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

export default CategoriesPage;