export const gstReturns = [
    {
        id: 'RET-2024-11',
        period: 'November 2024',
        type: 'GSTR-1',
        filingDate: '2024-12-10',
        status: 'filed',
        arn: 'AA0707190000001',
        taxableAmount: 450000,
        taxAmount: 81000
    },
    {
        id: 'RET-2024-11-3B',
        period: 'November 2024',
        type: 'GSTR-3B',
        filingDate: '2024-12-20',
        status: 'filed',
        arn: 'AA0707190000002',
        taxableAmount: 450000,
        taxAmount: 81000,
        itcClaimed: 45000,
        taxPaid: 36000
    }
];

export const tdsRecords = [
    {
        id: 'TDS-2024-001',
        section: '194J',
        natureOfPayment: 'Fees for Professional Services',
        deductee: 'Tech Consulting Pvt Ltd',
        pan: 'ABCDE1234F',
        paymentDate: '2024-12-05',
        amountPaid: 50000,
        tdsRate: 10,
        tdsAmount: 5000,
        status: 'deposited',
        challanNo: 'CH12345',
        challanDate: '2025-01-05'
    },
    {
        id: 'TDS-2024-002',
        section: '194C',
        natureOfPayment: 'Payments to Contractors',
        deductee: 'BuildRight Construction',
        pan: 'FGHIJ5678K',
        paymentDate: '2024-12-15',
        amountPaid: 100000,
        tdsRate: 2,
        tdsAmount: 2000,
        status: 'pending',
        challanNo: null,
        challanDate: null
    }
];

export const taxRegistry = [
    {
        id: 'TAX-001',
        name: 'GST (India)',
        code: 'GST-18',
        region: 'India',
        rate: 18,
        type: 'Percentage',
        category: 'Indirect',
        status: 'active',
        description: 'Standard Goods and Services Tax in India'
    },
    {
        id: 'TAX-002',
        name: 'VAT (UK)',
        code: 'VAT-20',
        region: 'United Kingdom',
        rate: 20,
        type: 'Percentage',
        category: 'Value Added Tax',
        status: 'active',
        description: 'Standard VAT rate for the UK'
    },
    {
        id: 'TAX-003',
        name: 'Sales Tax (NY)',
        code: 'ST-08',
        region: 'USA - New York',
        rate: 8.875,
        type: 'Percentage',
        category: 'Sales Tax',
        status: 'active',
        description: 'Combined State and local sales tax in New York City'
    }
];
