import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyTickets } from '../../api/tickets';

const TicketListPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    // Состояния фильтров
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchTickets();
    }, [statusFilter]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            // Передаем фильтры на сервер
            const params = {};
            if (statusFilter) params.status = statusFilter;

            const response = await getMyTickets(params);
            setTickets(response.data);
        } catch (error) {
            console.error("Ошибка загрузки тикетов", error);
            alert('Не удалось загрузить обращения');
        } finally {
            setLoading(false);
        }
    };

    // Функция для окрашивания статуса
    const getStatusColor = (status) => {
        switch(status) {
            case 'New': return 'blue';
            case 'InProgress': return 'orange';
            case 'Resolved': return 'green';
            case 'Closed': return 'gray';
            case 'Rejected': return 'red';
            default: return 'black';
        }
    };

    if (loading) return <p>Загрузка...</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Мои обращения</h2>
                <Link to="/client/tickets/create">
                    <button style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Создать обращение
                    </button>
                </Link>
            </div>

            {/* Фильтры */}
            <div style={{ marginBottom: '20px', padding: '10px', background: '#f9f9f9' }}>
                <label>Статус: </label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">Все</option>
                    <option value="New">Новые</option>
                    <option value="InProgress">В работе</option>
                    <option value="Resolved">Решенные</option>
                    <option value="Closed">Закрытые</option>
                </select>
            </div>

            {/* Таблица */}
            {tickets.length === 0 ? (
                <p>Обращений не найдено.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>#</th>
                        <th style={{ padding: '10px' }}>Тема</th>
                        <th style={{ padding: '10px' }}>Статус</th>
                        <th style={{ padding: '10px' }}>Приоритет</th>
                        <th style={{ padding: '10px' }}>Дата создания</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>
                                <Link to={`/client/tickets/${ticket.id}`}>#{ticket.id.toString().slice(0, 8)}</Link>
                            </td>
                            <td style={{ padding: '10px' }}>{ticket.title}</td>
                            <td style={{ padding: '10px' }}>
                  <span style={{ color: getStatusColor(ticket.status), fontWeight: 'bold' }}>
                    {ticket.status}
                  </span>
                            </td>
                            <td style={{ padding: '10px' }}>{ticket.priority}</td>
                            <td style={{ padding: '10px' }}>{new Date(ticket.createdAt).toLocaleString('ru-RU')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TicketListPage;