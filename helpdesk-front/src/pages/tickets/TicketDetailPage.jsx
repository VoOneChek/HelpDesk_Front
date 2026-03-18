import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTicketDetails, addComment, getTicketHistory } from '../../api/tickets';

const TicketDetailPage = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'history'

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const detailsRes = await getTicketDetails(id);
            setTicket(detailsRes.data);

            // Если comments не пришло в detailsRes.data.comments, нужно раскомментировать:
            // const commentsRes = await getTicketComments(id);
            // setComments(commentsRes.data);

            // Настройка: если бэкенд возвращает comments внутри TicketDetailsDto, то:
            setComments(detailsRes.data.comments || []);

            try {
                const histRes = await getTicketHistory(id);
                setHistory(histRes.data);
            } catch(e) {
                console.log("История недоступна или ошибка прав");
            }

        } catch (error) {
            console.error(error);
            alert('Ошибка загрузки данных');
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

    if (!ticket) return <p>Загрузка...</p>;

    return (
        <div>
            <h2>{ticket.title}</h2>
            <div style={{ background: '#f5f5f5', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
                <p><strong>Статус:</strong> {ticket.status}</p>
                <p><strong>Приоритет:</strong> {ticket.priority}</p>
                <p><strong>Категория:</strong> {ticket.categoryName}</p>
                <p><strong>Создано:</strong> {new Date(ticket.createdAt).toLocaleString('ru-RU')}</p>
                <hr />
                <p>{ticket.description}</p>
            </div>

            {/* Табы (Вкладки) */}
            <div style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
                <button
                    onClick={() => setActiveTab('comments')}
                    style={{ padding: '10px', borderBottom: activeTab === 'comments' ? '2px solid blue' : 'none' }}
                >
                    Комментарии ({comments.length})
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{ padding: '10px', borderBottom: activeTab === 'history' ? '2px solid blue' : 'none' }}
                >
                    История изменений
                </button>
            </div>

            {activeTab === 'comments' && (
                <div>
                    {/* Список комментариев */}
                    <div style={{ marginBottom: '20px' }}>
                        {comments.length === 0 && <p>Комментариев пока нет.</p>}
                        {comments.map((comm) => (
                            <div key={comm.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', background: '#fff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', color: '#666' }}>
                                    <strong>{comm.authorName}</strong>
                                    <span>{new Date(comm.createdAt).toLocaleString('ru-RU')}</span>
                                </div>
                                <p style={{ margin: '5px 0 0 0' }}>{comm.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Форма добавления комментария */}
                    {ticket.status !== 'Closed' && ticket.status !== 'Resolved' ? (
                        <form onSubmit={handleAddComment} style={{ background: '#f9f9f9', padding: '15px' }}>
                <textarea
                    rows="3"
                    style={{ width: '100%', marginBottom: '10px' }}
                    placeholder="Напишите комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                />
                            <button type="submit">Отправить</button>
                        </form>
                    ) : (
                        <p style={{ color: 'gray' }}>Обращение закрыто, комментирование недоступно.</p>
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {history.length === 0 && <p>История пуста.</p>}
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {history.map(h => (
                            <li key={h.changedAt} style={{ borderBottom: '1px dashed #eee', padding: '5px 0' }}>
                                <span style={{ fontSize: '0.85em', color: '#888' }}>{new Date(h.changedAt).toLocaleString('ru-RU')}</span>
                                <br/>
                                <strong>{h.changedBy}:</strong> {h.action}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TicketDetailPage;