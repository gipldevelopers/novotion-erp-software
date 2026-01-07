export const exportToCSV = (data, filename) => {
    if (!data || !data.length) {
        console.warn('No data to export');
        return;
    }

    // Extract headers
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row => headers.map(fieldName => {
            let val = row[fieldName];
            // Escape quotes and wrap in quotes if string contains comma
            if (typeof val === 'string') {
                val = val.replace(/"/g, '""');
                if (val.search(/("|,|\n)/g) >= 0) {
                    val = `"${val}"`;
                }
            }
            return val;
        }).join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
