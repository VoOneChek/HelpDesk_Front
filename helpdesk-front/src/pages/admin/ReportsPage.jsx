import React, { useState, useEffect } from 'react';
import { getReportData, exportReport } from '../../api/reports';
import { getAllUsers } from '../../api/users';

const ReportsPage = () => {
    const [reportData, setReportData] = useState(null);
    const [operators, setOperators] = useState([]);

    const today = new Date().toISOString().split('T')[0];
    const [filters, setFilters] = useState({
        from: today,
        to: today,
        status: '',
        categoryId: '',
        operatorId: ''
    });

    useEffect(() => {
        const fetchOperators = async () => {
            try {
                const res = await getAllUsers();
                const ops = res.data.filter(u => u.role === 'Operator');
                setOperators(ops);
            } catch(e) { console.error("Ошибка загрузки операторов"); }
        };
        fetchOperators();
    }, []);

    const handleInputChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const getCleanParams = () => {
        const params = { from: filters.from, to: filters.to };
        if (filters.status) params.status = filters.status;
        if (filters.categoryId) params.categoryId = filters.categoryId;
        if (filters.operatorId) params.operatorId = filters.operatorId;
        return params;
    };

    const generateReport = async () => {
        if (!filters.from || !filters.to) {
            alert("Выберите период!");
            return;
        }
        try {
            const res = await getReportData(getCleanParams());
            setReportData(res.data);
        } catch (e) {
            console.error(e);
            alert("Ошибка формирования отчета");
        }
    };

    const handleExport = (format) => {
        if (!filters.from || !filters.to) {
            alert("Выберите период!");
            return;
        }
        exportReport(getCleanParams(), format);
    };

    // --- Стили ---
    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    };

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    };

    const inputStyle = {
        padding: '10px 12px',
        border: '1px solid #D1D5DB',
        borderRadius: '8px',
        fontSize: '14px',
        minWidth: '150px',
        background: 'white',
        color: '#111827',
        colorScheme: 'light'
    };

    const btnAction = {
        padding: '10px 20px',
        background: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        height: 'fit-content'
    };

    return (
        <div style={{ padding: '20px', background: '#F9FAFB', minHeight: '100vh' }}>
            <h2 style={{ marginTop: 0, fontSize: '24px', color: '#111827', marginBottom: '24px' }}>Отчеты</h2>

            {/* Панель фильтров */}
            <div style={{ ...cardStyle, display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={inputGroupStyle}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>С:</label>
                    <input type="date" name="from" value={filters.from} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>По:</label>
                    <input type="date" name="to" value={filters.to} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Статус:</label>
                    <select name="status" value={filters.status} onChange={handleInputChange} style={{...inputStyle, background: 'white'}}>
                        <option value="">Все</option>
                        <option value="New">New</option>
                        <option value="InProgress">InProgress</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
                <div style={inputGroupStyle}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Оператор:</label>
                    <select name="operatorId" value={filters.operatorId} onChange={handleInputChange} style={{...inputStyle, background: 'white'}}>
                        <option value="">Все</option>
                        {operators.map(op => (
                            <option key={op.id} value={op.id}>{op.fullName}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                    <button onClick={generateReport} style={btnAction}>
                        Сформировать
                    </button>
                    <button onClick={() => handleExport('excel')} style={{ ...btnAction, background: '#10B981' }}>
                        Excel
                    </button>
                    <button onClick={() => handleExport('csv')} style={{ ...btnAction, background: '#6B7280' }}>
                        CSV
                    </button>
                </div>
            </div>

            {/* ОТОБРАЖЕНИЕ ОТЧЕТА */}
            {reportData && (
                <div style={{ marginTop: '32px' }}>
                    {/* Блок сводки (Карточки) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ ...cardStyle, borderLeft: '5px solid #4F46E5' }}>
                            <h4 style={{margin: 0, color: '#6B7280', fontSize: '14px', fontWeight: '500'}}>Всего обращений</h4>
                            <h2 style={{margin: '8px 0 0 0', fontSize: '28px', color: '#111827'}}>{reportData.summary.totalTickets}</h2>
                        </div>
                        <div style={{ ...cardStyle, borderLeft: '5px solid #10B981' }}>
                            <h4 style={{margin: 0, color: '#6B7280', fontSize: '14px', fontWeight: '500'}}>Закрыто</h4>
                            <h2 style={{margin: '8px 0 0 0', fontSize: '28px', color: '#111827'}}>{reportData.summary.closedTickets}</h2>
                        </div>
                        <div style={{ ...cardStyle, borderLeft: '5px solid #F59E0B' }}>
                            <h4 style={{margin: 0, color: '#6B7280', fontSize: '14px', fontWeight: '500'}}>Ср. время решения</h4>
                            <h2 style={{margin: '8px 0 0 0', fontSize: '28px', color: '#111827'}}>{reportData.summary.averageResolutionTime}</h2>
                        </div>
                        <div style={{ ...cardStyle, borderLeft: '5px solid #EF4444' }}>
                            <h4 style={{margin: 0, color: '#6B7280', fontSize: '14px', fontWeight: '500'}}>В работе</h4>
                            <h2 style={{margin: '8px 0 0 0', fontSize: '28px', color: '#111827'}}>{reportData.summary.openTickets}</h2>
                        </div>
                    </div>

                    {/* Блок детализации (Таблица) */}
                    <h3 style={{ color: '#374151', marginBottom: '16px' }}>Детализация ({reportData.details.length} записей)</h3>
                    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase' }}>ID</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase' }}>Тема</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase' }}>Статус</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase' }}>Дата</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase' }}>Клиент</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reportData.details.map(item => (
                                    <tr key={item.ticketId} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '14px' }}>{item.ticketId.toString().slice(0, 8)}</td>
                                        <td style={{ padding: '12px 16px', fontWeight: '500', color: '#111827' }}>{item.title}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    background: item.status === 'Closed' ? '#D1FAE5' : '#FEF3C7',
                                                    color: item.status === 'Closed' ? '#065F46' : '#92400E'
                                                }}>
                                                    {item.status}
                                                </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#4B5563', fontSize: '14px' }}>{new Date(item.createdAt).toLocaleString('ru-RU')}</td>
                                        <td style={{ padding: '12px 16px', color: '#4B5563', fontSize: '14px' }}>{item.clientName}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;