// Updated: 2025-12-27
export const customers = [
    {
        id: 'CUST-001',
        name: 'Alice Freeman',
        email: 'alice@enterprise-corp.com',
        phone: '+1 (555) 123-4567',
        company: 'Enterprise Corp',
        status: 'Active',
        type: 'Enterprise',
        address: '123 Business Blvd, New York, NY',
        totalSpent: 150000,
        joinDate: '2024-01-15',
        lastActivity: '2024-12-20',
    },
    {
        id: 'CUST-002',
        name: 'Bob Smith',
        email: 'bob@techstart.io',
        phone: '+1 (555) 987-6543',
        company: 'TechStart Inc',
        status: 'Active',
        type: 'SMB',
        address: '456 Startup Way, San Francisco, CA',
        totalSpent: 25000,
        joinDate: '2024-03-10',
        lastActivity: '2024-12-25',
    },
    {
        id: 'CUST-003',
        name: 'Carol Danvers',
        email: 'carol@global-logs.com',
        phone: '+1 (555) 456-7890',
        company: 'Global Logistics',
        status: 'Inactive',
        type: 'Mid-Market',
        address: '789 Shipping Ln, Miami, FL',
        totalSpent: 5000,
        joinDate: '2023-11-05',
        lastActivity: '2023-12-10',
    },
    {
        id: 'CUST-004',
        name: 'David Wright',
        email: 'david@creative-solutions.design',
        phone: '+1 (555) 222-3333',
        company: 'Creative Solutions',
        status: 'Active',
        type: 'SMB',
        address: '101 Design Ave, Austin, TX',
        totalSpent: 12000,
        joinDate: '2024-06-20',
        lastActivity: '2024-12-26',
    },
    {
        id: 'CUST-005',
        name: 'Eva Green',
        email: 'eva@green-energy.co',
        phone: '+1 (555) 777-8888',
        company: 'Green Energy Co',
        status: 'Active',
        type: 'Enterprise',
        address: '202 Solar Rd, Denver, CO',
        totalSpent: 85000,
        joinDate: '2024-02-01',
        lastActivity: '2024-12-22',
    }
];

export const leads = [
    {
        id: 'LEAD-001',
        name: 'John Doe',
        company: 'Future Tech',
        email: 'john@futuretech.com',
        phone: '+1 (555) 000-1111',
        value: 50000,
        stage: 'New', // New, Qualified, Proposal, Negotiation, Closed Won, Closed Lost
        source: 'Website',
        assignedTo: 'Admin User',
        createdAt: '2024-12-20',
    },
    {
        id: 'LEAD-002',
        name: 'Sarah Connor',
        company: 'Cyberdyne Systems',
        email: 'sarah@cyberdyne.net',
        phone: '+1 (555) 000-2222',
        value: 120000,
        stage: 'Negotiation',
        source: 'Referral',
        assignedTo: 'Admin User',
        createdAt: '2024-12-10',
    },
    {
        id: 'LEAD-003',
        name: 'Michael Scott',
        company: 'Dunder Mifflin',
        email: 'mscott@dundermifflin.com',
        phone: '+1 (555) 000-3333',
        value: 15000,
        stage: 'Qualified',
        source: 'Cold Call',
        assignedTo: 'Admin User',
        createdAt: '2024-12-22',
    },
    {
        id: 'LEAD-004',
        name: 'Bruce Wayne',
        company: 'Wayne Enterprises',
        email: 'bruce@wayne-ent.com',
        phone: '+1 (555) 000-9999',
        value: 500000,
        stage: 'Proposal',
        source: 'Event',
        assignedTo: 'Admin User',
        createdAt: '2024-12-15',
    },
    {
        id: 'LEAD-005',
        name: 'Clark Kent',
        company: 'Daily Planet',
        email: 'clark@dailyplanet.com',
        phone: '+1 (555) 000-8888',
        value: 5000,
        stage: 'Closed Lost',
        source: 'Inbound',
        assignedTo: 'Admin User',
        createdAt: '2024-11-20',
    },
    {
        id: 'LEAD-006',
        name: 'Tony Stark',
        company: 'Stark Industries',
        email: 'tony@stark.com',
        phone: '+1 (555) 000-7777',
        value: 1000000,
        stage: 'Closed Won',
        source: 'Referral',
        assignedTo: 'Admin User',
        createdAt: '2024-10-15',
    }
];

export const activities = [
    {
        id: 'ACT-001',
        type: 'Call',
        subject: 'Introductory Call with John Doe',
        description: 'Discussed initial requirements and budget.',
        date: '2024-12-26T10:00:00',
        relatedTo: 'LEAD-001',
        status: 'Completed',
    },
    {
        id: 'ACT-002',
        type: 'Meeting',
        subject: 'Demo with Cyberdyne',
        description: 'Product demo for Sarah Connor and team.',
        date: '2024-12-28T14:30:00',
        relatedTo: 'LEAD-002',
        status: 'Scheduled',
    },
    {
        id: 'ACT-003',
        type: 'Email',
        subject: 'Proposal Sent to Wayne Ent',
        description: 'Sent the Q4 enterprise proposal.',
        date: '2024-12-25T09:15:00',
        relatedTo: 'LEAD-004',
        status: 'Completed',
    },
    {
        id: 'ACT-004',
        type: 'Task',
        subject: 'Follow up with Michael Scott',
        description: 'Check if they reviewed the paper catalog.',
        date: '2024-12-29T11:00:00',
        relatedTo: 'LEAD-003',
        status: 'Pending',
    }
];

export const tasks = [
    {
        id: 'TASK-001',
        title: 'Prepare Q1 Report',
        priority: 'High',
        dueDate: '2024-12-30',
        status: 'In Progress',
        assignedTo: 'Admin User',
        relatedTo: 'Internal',
    },
    {
        id: 'TASK-002',
        title: 'Update CRM Contacts',
        priority: 'Medium',
        dueDate: '2025-01-05',
        status: 'Not Started',
        assignedTo: 'Admin User',
        relatedTo: 'General',
    },
    {
        id: 'TASK-003',
        title: 'Send Invoice to Enterprise Corp',
        priority: 'High',
        dueDate: '2024-12-28',
        status: 'Pending',
        assignedTo: 'Accounting Team',
        relatedTo: 'CUST-001',
    }
];

export const communications = [
    {
        id: 'COMM-001',
        type: 'Email',
        subject: 'Re: Project Timeline',
        content: 'Hi Alice, the project is on track for delivery next week...',
        from: 'me@company.com',
        to: 'alice@enterprise-corp.com',
        date: '2024-12-26T15:30:00',
        read: true,
    },
    {
        id: 'COMM-002',
        type: 'Call Log',
        subject: 'Weekly Sync',
        content: 'Discussed blocking issues with dev team.',
        from: 'Bob Smith',
        to: 'me@company.com',
    },
    { id: 'COMM-1', type: 'Email', from: 'rahul@alpha.com', to: 'me@company.com', subject: 'Re: Inquiry', content: 'Checking regarding the previous inquiry.', date: '2024-12-20T10:30:00', read: true },
    { id: 'COMM-2', type: 'WhatsApp', from: '+91 9988776655', to: 'Company WA', content: 'Can you send the brochure?', date: '2024-12-21T15:45:00', read: false },
];

export const invoices = [
    {
        id: 'INV-2024-001',
        customerId: 'CUST-001',
        date: '2024-12-15',
        dueDate: '2025-01-14',
        amount: 5000,
        status: 'Unpaid',
        items: [{ description: 'Consulting Services', quantity: 10, rate: 500 }]
    },
    {
        id: 'INV-2024-002',
        customerId: 'CUST-001',
        date: '2024-11-20',
        dueDate: '2024-12-20',
        amount: 2500,
        status: 'Paid',
        items: [{ description: 'Support Package', quantity: 1, rate: 2500 }]
    }
];

export const payments = [
    {
        id: 'PAY-001',
        customerId: 'CUST-001',
        invoiceId: 'INV-2024-002',
        date: '2024-12-18',
        amount: 2500,
        method: 'Bank Transfer'
    }
];
export const quotations = [
    {
        id: 'QT-1001',
        customerId: 'CUST-001',
        customerName: 'Alice Freeman',
        date: '2024-12-28T10:00:00',
        validUntil: '2025-01-28T10:00:00',
        status: 'Sent',
        subtotal: 5000,
        taxTotal: 900,
        totalAmount: 5900,
        items: [
            { description: 'Consulting Services', quantity: 10, rate: 500, amount: 5000 }
        ],
        version: 1
    }
];

export const contracts = [
    {
        id: 'CTR-5001',
        title: 'Annual Maintenance Contract',
        customerId: 'CUST-001',
        type: 'AMC',
        value: 12000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Active'
    }
];

export const kpimetrics = [
    { title: 'Total Revenue', value: '$12,345', trend: '+12%' },
    { title: 'Active Leads', value: '45', trend: '+5%' },
    { title: 'Win Rate', value: '68%', trend: '+2%' },
    { title: 'Avg Deal Size', value: '$2,400', trend: '-1%' }
];
