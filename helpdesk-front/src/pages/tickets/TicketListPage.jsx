import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyTickets } from '../../api/tickets';
import { getAllCategories } from '../../api/categories'; // Импортируем API категорий

const TicketListPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Состояния фильтров
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [searchInput, setSearchInput] = useState(''); // То, что пользователь печатает
    const [searchQuery, setSearchQuery] = useState(''); // То, что уходит на сервер (после Enter)

    const [categories, setCategories] = useState([]);

    // Загрузка категорий при монтировании
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories(res.data);
            } catch (e) {
                console.error("Не удалось загрузить категории");
            }
        };
        fetchCategories();
    }, []);

    // Загрузка тикетов при изменении фильтров
    useEffect(() => {
        fetchTickets();
    }, [statusFilter, categoryFilter, searchQuery]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (categoryFilter) params.categoryId = categoryFilter;
            if (searchQuery) params.SearchString = searchQuery;

            const response = await getMyTickets(params);
            setTickets(response.data);
        } catch (error) {
            console.error("Ошибка загрузки тикетов", error);
            alert('Не удалось загрузить обращения');
        } finally {
            setLoading(false);
        }
    };

    // Обработчик поиска по нажатию Enter
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setSearchQuery(searchInput);
        }
    };

    // Сброс всех фильтров
    const handleResetFilters = () => {
        setStatusFilter('');
        setCategoryFilter('');
        setSearchInput('');
        setSearchQuery('');
    };

    // Конфиг стилей для статусов
    const statusStyles = {
        'New': { bg: '#EEF2FF', color: '#4F46E5', label: 'Новый' },
        'InProgress': { bg: '#FEF3C7', color: '#D97706', label: 'В работе' },
        'Resolved': { bg: '#D1FAE5', color: '#059669', label: 'Решен' },
        'Closed': { bg: '#F3F4F6', color: '#4B5563', label: 'Закрыт' },
        'Rejected': { bg: '#FEE2E2', color: '#DC2626', label: 'Отклонен' }
    };

    const priorityStyles = {
        'Low': { bg: '#E5E7EB', color: '#4B5563', label: 'Низкий' },
        'Medium': { bg: '#DBEAFE', color: '#2563EB', label: 'Средний' },
        'High': { bg: '#FEF3C7', color: '#B45309', label: 'Высокий' },
        'Critical': { bg: '#FEE2E2', color: '#B91C1C', label: 'Критический' }
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

    const btnPrimary = {
        padding: '10px 20px',
        background: '#4F46E5',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        border: 'none',
        cursor: 'pointer'
    };

    const filterBarStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 24px',
        borderBottom: '1px solid #E5E7EB',
        background: '#F9FAFB',
        flexWrap: 'wrap'
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

    const btnSmall = {
        padding: '6px 12px',
        background: '#E5E7EB',
        color: '#374151',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '13px'
    };

    if (loading) return (
        <div style={{...pageStyle, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <p style={{ color: '#6B7280' }}>Загрузка...</p>
        </div>
    );

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Мои обращения</h2>
                <Link to="/client/tickets/create" style={btnPrimary}>
                    <span style={{fontSize: '18px'}}>+</span> Создать обращение
                </Link>
            </div>

            <div style={cardStyle}>
                {/* Фильтры */}
                <div style={filterBarStyle}>
                    {/* Поиск */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
                        <input
                            type="text"
                            placeholder="Поиск по теме или описанию..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            style={searchInputStyle}
                        />
                        <button onClick={() => setSearchQuery(searchInput)} style={btnPrimary}>
                            Найти
                        </button>
                    </div>

                    {/* Выбор категории */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap' }}>Категория:</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Все категории</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Выбор статуса */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap' }}>Статус:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Все статусы</option>
                            <option value="New">Новые</option>
                            <option value="InProgress">В работе</option>
                            <option value="WaitingForClient">Ожидает клиента</option>
                            <option value="Closed">Закрытые</option>
                            <option value="Rejected">Отклонённые</option>
                        </select>
                    </div>

                    {/* Кнопка сброса */}
                    {(statusFilter || categoryFilter || searchQuery) && (
                        <button onClick={handleResetFilters} style={btnSmall}>
                            Сбросить
                        </button>
                    )}
                </div>

                {/* Таблица */}
                {tickets.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                        <p style={{ margin: 0 }}>Обращений не найдено.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <th style={tableHeaderStyle}>Номер</th>
                                <th style={tableHeaderStyle}>Тема</th>
                                <th style={tableHeaderStyle}>Статус</th>
                                <th style={tableHeaderStyle}>Приоритет</th>
                                <th style={tableHeaderStyle}>Дата создания</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((ticket) => {
                                const sStyle = statusStyles[ticket.status] || { bg: '#F3F4F6', color: '#111827', label: ticket.status };
                                const pStyle = priorityStyles[ticket.priority] || { bg: '#F3F4F6', color: '#111827', label: ticket.priority };

                                return (
                                    <tr
                                        key={ticket.id}
                                        style={{
                                            borderBottom: '1px solid #F3F4F6',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <Link
                                                to={`/client/tickets/${ticket.id}`}
                                                style={linkStyle}
                                            >
                                                #{ticket.id.toString().slice(0, 8)}
                                            </Link>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: '500', color: '#111827' }}>
                                            {ticket.title}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    background: sStyle.bg,
                                                    color: sStyle.color
                                                }}>
                                                    {sStyle.label}
                                                </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    background: pStyle.bg,
                                                    color: pStyle.color
                                                }}>
                                                    {pStyle.label}
                                                </span>
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

export default TicketListPage;