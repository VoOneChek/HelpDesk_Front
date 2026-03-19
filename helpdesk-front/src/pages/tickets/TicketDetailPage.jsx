import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketDetails, addComment, getTicketHistory, assignTicket, changeTicketStatus } from '../../api/tickets';
import { RefreshContext } from '../../context/RefreshContext.jsx';
import { AuthContext } from '../../context/AuthContext';

const TicketDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { triggerRefresh } = useContext(RefreshContext);

    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('comments');
    const [loading, setLoading] = useState(true);

    const isStaff = user && (user.role === 'Operator' || user.role === 'Admin');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const detailsRes = await getTicketDetails(id);
            setTicket(detailsRes.data);
            setComments(detailsRes.data?.comments || []);

            try {
                const histRes = await getTicketHistory(id);
                setHistory(histRes.data || []);
            } catch(e) {
                console.log("История недоступна");
                setHistory([]);
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await addComment(id, newComment);
            setComments([...comments, res.data]);
            setNewComment('');
        } catch (error) {
            alert('Ошибка при отправке комментария');
        }
    };

    const handleAssign = async () => {
        try {
            await assignTicket(id);
            alert('Тикет назначен на вас');
            triggerRefresh();
            fetchData();
        } catch(e) {
            alert('Ошибка назначения');
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await changeTicketStatus(id, newStatus);
            alert('Статус изменен');
            triggerRefresh();
            fetchData();
        } catch(e) {
            alert('Ошибка изменения статуса');
        }
    };

    // --- Конфигурация стилей ---
    const statusConfig = {
        'New': { bg: '#EEF2FF', color: '#4F46E5', label: 'Новый' },
        'InProgress': { bg: '#FEF3C7', color: '#D97706', label: 'В работе' },
        'Resolved': { bg: '#D1FAE5', color: '#059669', label: 'Решен' },
        'Closed': { bg: '#F3F4F6', color: '#4B5563', label: 'Закрыт' },
        'Rejected': { bg: '#FEE2E2', color: '#DC2626', label: 'Отклонен' }
    };

    const priorityConfig = {
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
        overflow: 'hidden',
        marginBottom: '24px'
    };

    const btnBackStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'transparent',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        color: '#4B5563',
        cursor: 'pointer',
        fontWeight: '500',
        marginBottom: '24px',
        transition: 'all 0.2s'
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

    if (loading) return <div style={{...pageStyle, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><p>Загрузка...</p></div>;
    if (!ticket) return <div style={pageStyle}><p>Обращение не найдено</p></div>;

    const currentStatus = statusConfig[ticket.status] || { bg: '#F3F4F6', color: '#111827', label: ticket.status };
    const currentPriority = priorityConfig[ticket.priority] || { bg: '#F3F4F6', color: '#111827', label: ticket.priority };

    return (
        <div style={pageStyle}>
            <button onClick={() => navigate(-1)} style={btnBackStyle}>
                &larr; Назад к списку
            </button>

            {/* Заголовок */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>{ticket.title}</h2>
                <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
                    #{ticket.id.toString().slice(0, 8)} · создан {new Date(ticket.createdAt).toLocaleString('ru-RU')}
                </p>
            </div>

            {/* Основная информация */}
            <div style={cardStyle}>
                <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' }}>Статус</span>
                            <div style={{ marginTop: '4px' }}>
                                <span style={{ background: currentStatus.bg, color: currentStatus.color, padding: '4px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '14px' }}>
                                    {currentStatus.label}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' }}>Приоритет</span>
                            <div style={{ marginTop: '4px' }}>
                                <span style={{ background: currentPriority.bg, color: currentPriority.color, padding: '4px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '14px' }}>
                                    {currentPriority.label}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' }}>Категория</span>
                            <p style={{ margin: '4px 0 0 0', fontWeight: '500', color: '#111827' }}>{ticket.categoryName || 'Не указана'}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' }}>Клиент</span>
                            <p style={{ margin: '4px 0 0 0', fontWeight: '500', color: '#111827' }}>{ticket.clientName || 'Неизвестен'}</p>
                        </div>
                    </div>

                    <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #4F46E5' }}>
                        <p style={{ margin: 0, color: '#374151', whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
                    </div>
                </div>

                {/* Информация об операторе */}
                {ticket.operatorName && (
                    <div style={{ padding: '16px 24px', background: '#F9FAFB', borderTop: '1px solid #F3F4F6' }}>
                        <span style={{ fontSize: '12px', color: '#6B7280' }}>Исполнитель: </span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{ticket.operatorName}</span>
                    </div>
                )}
            </div>

            {/* Блок управления для Оператора */}
            {isStaff && (
                <div style={{ ...cardStyle, border: '1px solid #4F46E5', background: '#F5F3FF' }}>
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', color: '#4F46E5' }}>Панель управления</h4>
                            {ticket.operatorName ? (
                                <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Назначен: <strong>{ticket.operatorName}</strong></p>
                            ) : (
                                <p style={{ margin: 0, fontSize: '14px', color: '#EF4444' }}>Не назначен</p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {!ticket.operatorName && (
                                <button onClick={handleAssign} style={{...btnPrimary, background: '#10B981'}}>
                                    Назначить на себя
                                </button>
                            )}

                            <select
                                onChange={(e) => handleStatusChange(e.target.value)}
                                defaultValue={ticket.status}
                                style={{ ...inputStyle, width: 'auto', minWidth: '150px' }}
                            >
                                <option value="New">Новый</option>
                                <option value="InProgress">В работу</option>
                                <option value="WaitingForClient">Ожидать клиента</option>
                                <option value="Closed">Закрыть</option>
                                <option value="Rejected">Отклонить</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Табы */}
            <div style={{ borderBottom: '1px solid #E5E7EB', marginBottom: '20px', display: 'flex', gap: '24px' }}>
                <button
                    onClick={() => setActiveTab('comments')}
                    style={{
                        padding: '12px 0',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: activeTab === 'comments' ? '2px solid #4F46E5' : '2px solid transparent',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: activeTab === 'comments' ? '#4F46E5' : '#6B7280',
                        marginBottom: '-1px'
                    }}
                >
                    Комментарии ({comments.length})
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{
                        padding: '12px 0',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: activeTab === 'history' ? '2px solid #4F46E5' : '2px solid transparent',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: activeTab === 'history' ? '#4F46E5' : '#6B7280',
                        marginBottom: '-1px'
                    }}
                >
                    История изменений
                </button>
            </div>

            {/* Контент табов */}
            {activeTab === 'comments' && (
                <div>
                    <div style={{ marginBottom: '24px' }}>
                        {comments.length === 0 &&
                            <div style={{textAlign: 'center', padding: '40px', color: '#9CA3AF'}}>
                                Комментариев пока нет.
                            </div>
                        }
                        {comments.map((comm) => (
                            <div key={comm.id} style={{ background: 'white', padding: '16px', marginBottom: '12px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                                    <strong style={{ color: '#111827' }}>{comm.authorName || 'Аноним'}</strong>
                                    <span>{new Date(comm.createdAt).toLocaleString('ru-RU')}</span>
                                </div>
                                <p style={{ margin: 0, color: '#374151', lineHeight: '1.5' }}>{comm.content}</p>
                            </div>
                        ))}
                    </div>

                    {ticket.status !== 'Closed' && ticket.status !== 'Resolved' ? (
                        <form onSubmit={handleAddComment} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Ваш ответ</label>
                            <textarea
                                rows="3"
                                style={{ ...inputStyle, marginBottom: '12px' }}
                                placeholder="Введите текст комментария..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                            />
                            <div style={{ textAlign: 'right' }}>
                                <button type="submit" style={btnPrimary}>Отправить</button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ background: '#F3F4F6', padding: '16px', borderRadius: '8px', textAlign: 'center', color: '#6B7280' }}>
                            Обращение закрыто, комментирование недоступно.
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '8px' }}>
                    {history.length === 0 &&
                        <div style={{textAlign: 'center', padding: '40px', color: '#9CA3AF'}}>
                            История пуста.
                        </div>
                    }
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {history.map(h => (
                            <li key={h.changedAt + h.action} style={{ padding: '16px', borderBottom: '1px solid #F3F4F6' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: '600', color: '#111827' }}>{h.changedBy || 'Система'}</span>
                                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{new Date(h.changedAt).toLocaleString('ru-RU')}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', color: '#4B5563' }}>{h.action}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TicketDetailPage;