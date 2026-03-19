import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getAllTickets } from '../../api/tickets';
import { getAllCategories } from '../../api/categories';
import { AuthContext } from '../../context/AuthContext';

const OperatorTicketListPage = () => {
    const { user } = useContext(AuthContext);

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Фильтры
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [showOnlyMine, setShowOnlyMine] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories(res.data);
            } catch(e) {
                console.error("Не удалось загрузить категории");
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [statusFilter, searchTerm, showOnlyMine, categoryFilter]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (searchTerm) params.searchString = searchTerm;
            if (categoryFilter) params.categoryId = categoryFilter;

            if (showOnlyMine && user) {
                params.operatorId = user.id;
            }

            const response = await getAllTickets(params);
            setTickets(response.data);
        } catch (error) {
            console.error("Ошибка загрузки", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchTerm(searchInput);
    };

    const handleReset = () => {
        setStatusFilter('');
        setSearchTerm('');
        setSearchInput('');
        setShowOnlyMine(false);
        setCategoryFilter('');
    };

    // Конфиг стилей
    const statusConfig = {
        'New': { bg: '#EEF2FF', color: '#4F46E5', label: 'Новый' },
        'InProgress': { bg: '#FEF3C7', color: '#D97706', label: 'В работе' },
        'Resolved': { bg: '#D1FAE5', color: '#059669', label: 'Решен' },
        'Closed': { bg: '#F3F4F6', color: '#4B5563', label: 'Закрыт' },
        'Rejected': { bg: '#FEE2E2', color: '#DC2626', label: 'Отклонен' }
    };

    // --- Стили ---
    const pageStyle = {
        padding: '20px',
        background: '#F9FAFB',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    };

    const filterBarStyle = {
        padding: '20px 24px',
        borderBottom: '1px solid #E5E7EB',
        background: '#F9FAFB'
    };

    const inputStyle = {
        padding: '8px 12px',
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        fontSize: '14px',
        background: 'white',
        color: '#111827',
        minWidth: '150px'
    };

    const searchInputStyle = {
        ...inputStyle,
        flexGrow: 1,
        minWidth: '200px'
    };

    const btnPrimary = {
        padding: '8px 16px',
        background: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px'
    };

    const btnSecondary = {
        padding: '8px 16px',
        background: '#F3F4F6',
        color: '#374151',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px'
    };

    const tableHeaderStyle = {
        padding: '12px 16px',
        textAlign: 'left',
        color: '#6B7280',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '600'
    };

    const linkStyle = {
        color: '#4F46E5',
        textDecoration: 'none',
        fontWeight: '600'
    };

    const checkboxContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        userSelect: 'none'
    };

    if (loading) return (
        <div style={{...pageStyle, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <p style={{ color: '#6B7280' }}>Загрузка...</p>
        </div>
    );

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Все обращения</h2>
                {/* Можно добавить кнопки экспорта или другие действия здесь */}
            </div>

            <div style={cardStyle}>
                {/* Панель фильтров */}
                <div style={filterBarStyle}>
                    {/* Первая строка: Фильтры и Поиск */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '16px' }}>

                        {/* Поиск */}
                        <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '300px' }}>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Поиск по теме или описанию..."
                                style={searchInputStyle}
                            />
                            <button onClick={handleSearch} style={btnPrimary}>Найти</button>
                        </div>

                        {/* Статус */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280' }}>Статус</label>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
                                <option value="">Все статусы</option>
                                <option value="New">Новые</option>
                                <option value="InProgress">В работе</option>
                                <option value="WaitingForClient">Ожидает клиента</option>
                                <option value="Closed">Закрытые</option>
                                <option value="Rejected">Отклонённые</option>
                            </select>
                        </div>

                        {/* Категория */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280' }}>Категория</label>
                            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={inputStyle}>
                                <option value="">Все</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Сброс */}
                        <button onClick={handleReset} style={btnSecondary}>Сбросить</button>
                    </div>

                    {/* Вторая строка: Чекбокс */}
                    <div style={checkboxContainerStyle} onClick={() => setShowOnlyMine(!showOnlyMine)}>
                        <input
                            type="checkbox"
                            checked={showOnlyMine}
                            onChange={(e) => setShowOnlyMine(e.target.checked)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                            Показать только назначенные мне
                        </span>
                    </div>
                </div>

                {/* Таблица */}
                {tickets.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                        <p style={{ margin: 0 }}>Обращений не найдено.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead>
                            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <th style={tableHeaderStyle}>ID</th>
                                <th style={tableHeaderStyle}>Тема</th>
                                <th style={tableHeaderStyle}>Клиент</th>
                                <th style={tableHeaderStyle}>Категория</th>
                                <th style={tableHeaderStyle}>Статус</th>
                                <th style={tableHeaderStyle}>Оператор</th>
                                <th style={tableHeaderStyle}>Дата</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((ticket) => {
                                const sConfig = statusConfig[ticket.status] || { bg: '#F3F4F6', color: '#111827', label: ticket.status };

                                return (
                                    <tr
                                        key={ticket.id}
                                        style={{
                                            borderBottom: '1px solid #F3F4F6',
                                            transition: 'background 0.2s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <Link
                                                to={`/operator/tickets/${ticket.id}`}
                                                style={linkStyle}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                #{ticket.id.toString().slice(0, 8)}
                                            </Link>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: '500', color: '#111827' }}>
                                            {ticket.title}
                                        </td>
                                        <td style={{ padding: '16px', color: '#4B5563' }}>
                                            {ticket.clientName}
                                        </td>
                                        <td style={{ padding: '16px', color: '#4B5563' }}>
                                            {ticket.categoryName || '-'}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    background: sConfig.bg,
                                                    color: sConfig.color
                                                }}>
                                                    {sConfig.label}
                                                </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {ticket.operatorName ? (
                                                <span style={{ color: '#111827' }}>{ticket.operatorName}</span>
                                            ) : (
                                                <span style={{
                                                    background: '#FEF3C7',
                                                    color: '#92400E',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}>
                                                        Не назначен
                                                    </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px', color: '#6B7280', fontSize: '14px' }}>
                                            {new Date(ticket.createdAt).toLocaleString('ru-RU')}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OperatorTicketListPage;