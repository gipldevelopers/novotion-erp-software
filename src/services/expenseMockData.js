export const expenseCategories = [
    { id: 'cat_001', name: 'Office Supplies', type: 'operating', gstRate: 18 },
    { id: 'cat_002', name: 'Travel & Transport', type: 'operating', gstRate: 5 },
    { id: 'cat_003', name: 'Utilities (Electricity/Water)', type: 'operating', gstRate: 0 },
    { id: 'cat_004', name: 'Rent & Lease', type: 'operating', gstRate: 18 },
    { id: 'cat_005', name: 'Software Subscriptions', type: 'operating', gstRate: 18 },
    { id: 'cat_006', name: 'Employee Training', type: 'hr', gstRate: 18 },
    { id: 'cat_007', name: 'Meals & Entertainment', type: 'hr', gstRate: 5 },
    { id: 'cat_008', name: 'Legal & Professional Fees', type: 'admin', gstRate: 18 },
    { id: 'cat_009', name: 'Maintenance & Repairs', type: 'operating', gstRate: 18 },
    { id: 'cat_010', name: 'Marketing & Advertising', type: 'marketing', gstRate: 18 }
];

export const expenseRecords = [
    {
        id: 'EXP-2024-001',
        date: '2024-12-28',
        description: 'Office Chair Purchase',
        amount: 15000,
        gstAmount: 2700,
        totalAmount: 17700,
        category: 'Office Supplies',
        vendorId: 'VEN-001',
        status: 'approved',
        paymentStatus: 'paid',
        submittedBy: 'John Admin',
        approvedBy: 'Finance Manager',
        attachment: 'invoice_chair.pdf'
    },
    {
        id: 'EXP-2024-002',
        date: '2024-12-29',
        description: 'Server Hosting (AWS)',
        amount: 25000,
        gstAmount: 4500,
        totalAmount: 29500,
        category: 'Software Subscriptions',
        vendorId: 'VEN-005',
        status: 'pending',
        paymentStatus: 'unpaid',
        submittedBy: 'Tech Lead',
        approvedBy: null,
        attachment: 'aws_dec_bill.pdf'
    },
    {
        id: 'EXP-2024-003',
        date: '2024-12-30',
        description: 'Team Lunch',
        amount: 4500,
        gstAmount: 225,
        totalAmount: 4725,
        category: 'Meals & Entertainment',
        vendorId: null, // Cash expense
        status: 'approved',
        paymentStatus: 'reimbursed',
        submittedBy: 'HR Manager',
        approvedBy: 'Finance Manager',
        attachment: 'lunch_receipt.jpg'
    }
];
