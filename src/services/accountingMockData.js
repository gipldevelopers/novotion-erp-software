// Updated: 2025-12-27

export const accountingInvoices = [
    {
        id: 'INV-001',
        number: 'INV-2024-001',
        customer: 'Acme Corporation',
        email: 'contact@acmecorp.com',
        amount: 28320,
        status: 'paid',
        dueDate: '2025-01-10',
        createdAt: '2024-12-27T10:30:00',
        source: 'pos',
        items: [
            { name: 'Business Consulting', quantity: 4, rate: 2500, amount: 10000 },
            { name: 'Software Training', quantity: 1, rate: 15000, amount: 15000 },
        ]
    },
    {
        id: 'INV-002',
        number: 'INV-2024-002',
        customer: 'Tech Solutions Pvt Ltd',
        email: 'info@techsolutions.in',
        amount: 3400,
        status: 'pending',
        dueDate: '2024-12-30',
        createdAt: '2024-12-25T14:20:00',
        source: 'accounting'
    },
    {
        id: 'INV-003',
        number: 'INV-2024-003',
        customer: 'Global Solutions',
        email: 'accounts@global.com',
        amount: 8900,
        status: 'overdue',
        dueDate: '2024-12-20',
        createdAt: '2024-12-15T09:00:00',
        source: 'accounting'
    }
];

export const ledgers = [
    { id: '1', account: 'Cash in Hand', category: 'Assets', balance: 15000 },
    { id: '2', account: 'Bank Account', category: 'Assets', balance: 125000 },
    { id: '3', account: 'Sales Revenue', category: 'Income', balance: 31720 },
    { id: '4', account: 'Office Rent', category: 'Expenses', balance: 5000 },
];

export const expenses = [
    { id: '1', description: 'Office Supplies', amount: 500, category: 'General', date: '2024-12-20', status: 'paid' },
    { id: '2', description: 'Internet Bill', amount: 1200, category: 'Utilities', date: '2024-12-24', status: 'paid' },
];
