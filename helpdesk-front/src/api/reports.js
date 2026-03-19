import client from './client';

export const getReportData = (filters) => {
    return client.post('/reports/search', filters);
};

export const exportReport = async (filters, format) => {
    try {
        const response = await client.post(`/reports/export?format=${format}`, filters, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        const contentDisposition = response.headers['content-disposition'];
        let fileName = `report.${format === 'excel' ? 'xlsx' : 'csv'}`;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
        }

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Ошибка экспорта', error);
        alert('Не удалось скачать отчет');
    }
};