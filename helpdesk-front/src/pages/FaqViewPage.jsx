import React, { useState, useEffect } from 'react';
import { getFaqs } from '../api/faq';

const FaqViewPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [openId, setOpenId] = useState(null);

    useEffect(() => {
        getFaqs().then(res => setFaqs(res.data));
    }, []);

    const toggleFaq = (id) => {
        setOpenId(prevId => (prevId === id ? null : id));
    };

    // --- Стили (в едином стиле с остальными страницами) ---
    const containerStyle = {
        padding: '20px',
        background: '#F9FAFB',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    };

    const headerStyle = {
        fontSize: '24px',
        color: '#111827',
        marginBottom: '24px',
        marginTop: 0,
        fontWeight: '600'
    };

    const emptyStyle = {
        textAlign: 'center',
        color: '#6B7280',
        padding: '40px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };

    const itemStyle = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        marginBottom: '12px',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        transition: 'box-shadow 0.2s'
    };

    const questionStyle = (isOpen) => ({
        padding: '16px 20px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: isOpen ? '#F9FAFB' : 'white',
        borderBottom: isOpen ? '1px solid #E5E7EB' : 'none',
        transition: 'background 0.2s'
    });

    const questionTextStyle = {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1F2937'
    };

    const iconStyle = (isOpen) => ({
        fontSize: '20px',
        color: '#4F46E5',
        transition: 'transform 0.3s',
        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
    });

    const answerStyle = {
        padding: '20px',
        color: '#374151',
        fontSize: '15px',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        backgroundColor: 'white'
    };

    return (
        <div style={containerStyle}>
            <h2 style={headerStyle}>База знаний</h2>

            {faqs.length === 0 ? (
                <div style={emptyStyle}>
                    <p style={{ margin: 0 }}>Статей пока нет. Загляните позже!</p>
                </div>
            ) : (
                <div>
                    {faqs.map(faq => {
                        const isOpen = openId === faq.id;
                        return (
                            <div key={faq.id} style={itemStyle}>
                                <div
                                    style={questionStyle(isOpen)}
                                    onClick={() => toggleFaq(faq.id)}
                                >
                                    <span style={questionTextStyle}>{faq.title}</span>
                                    {/* Иконка плюса, которая поворачивается при открытии */}
                                    <span style={iconStyle(isOpen)}>
                                        +
                                    </span>
                                </div>
                                {/* Показываем ответ только если вопрос открыт */}
                                {isOpen && (
                                    <div style={answerStyle}>
                                        {faq.content}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FaqViewPage;