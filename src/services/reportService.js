import { ledgers, accountingInvoices, expenses } from './accountingMockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class ReportService {
    async getProfitLoss(startDate, endDate) {
        await delay(500);

        // Simple aggregation logic based on mock ledgers
        const income = ledgers
            .filter(l => l.category === 'Income')
            .reduce((sum, l) => sum + l.balance, 0);

        const expense = ledgers
            .filter(l => l.category === 'Expense')
            .reduce((sum, l) => sum + l.balance, 0);

        // Add dynamically calculated totals from recent transactions if not already in ledger (Mock sync)

        return {
            income: {
                total: income,
                breakdown: ledgers.filter(l => l.category === 'Income')
            },
            expense: {
                total: expense,
                breakdown: ledgers.filter(l => l.category === 'Expense')
            },
            netProfit: income - expense
        };
    }

    async getCashFlow(period) {
        await delay(500);

        // Mock Cash Flow Data (Direct Method)
        const operating = {
            inflow: [
                { id: 1, account: 'Cash Receipts from Customers', amount: 1250000 },
                { id: 2, account: 'Tax Refunds', amount: 25000 }
            ],
            outflow: [
                { id: 3, account: 'Payments to Suppliers', amount: -450000 },
                { id: 4, account: 'Payments to Employees', amount: -280000 },
                { id: 5, account: 'Tax Payments', amount: -45000 }
            ]
        };

        const investing = {
            inflow: [
                { id: 6, account: 'Sale of Equipment', amount: 80000 }
            ],
            outflow: [
                { id: 7, account: 'Purchase of Equipment', amount: -200000 }
            ]
        };

        const financing = {
            inflow: [
                { id: 8, account: 'Bank Loan', amount: 500000 }
            ],
            outflow: [
                { id: 9, account: 'Loan Repayment', amount: -50000 }
            ]
        };

        const calculateNet = (section) => {
            const totalIn = section.inflow.reduce((s, i) => s + i.amount, 0);
            const totalOut = section.outflow.reduce((s, i) => s + i.amount, 0);
            return totalIn + totalOut;
        };

        return {
            operating: { ...operating, net: calculateNet(operating) },
            investing: { ...investing, net: calculateNet(investing) },
            financing: { ...financing, net: calculateNet(financing) },
            openingBalance: 150000,
            closingBalance: 150000 + calculateNet(operating) + calculateNet(investing) + calculateNet(financing)
        };
    }

    async getAgedReceivables() {
        await delay(500);

        // Mock Aggregation
        return {
            summary: {
                totalOutstanding: 450000,
                overdue: 125000
            },
            buckets: [
                { range: '1-30 Days', amount: 250000, count: 12, color: 'text-green-600' },
                { range: '31-60 Days', amount: 75000, count: 5, color: 'text-yellow-600' },
                { range: '61-90 Days', amount: 50000, count: 3, color: 'text-orange-600' },
                { range: '90+ Days', amount: 75000, count: 2, color: 'text-red-600' }
            ],
            customers: [
                { id: 'CUST-001', name: 'Acme Corp', amount: 120000, buckets: { current: 80000, b30: 20000, b60: 20000, b90: 0 } },
                { id: 'CUST-002', name: 'Global Tech', amount: 55000, buckets: { current: 0, b30: 55000, b60: 0, b90: 0 } },
                { id: 'CUST-003', name: 'Stark Ind', amount: 75000, buckets: { current: 0, b30: 0, b60: 0, b90: 75000 } },
            ]
        };
    }

    async getRevenueAnalysis() {
        await delay(500);

        return {
            totalRevenue: 2500000,
            growth: 12.5,
            monthly: [
                { month: 'Jan', amount: 180000 },
                { month: 'Feb', amount: 220000 },
                { month: 'Mar', amount: 190000 },
                { month: 'Apr', amount: 250000 },
                { month: 'May', amount: 280000 },
                { month: 'Jun', amount: 320000 },
            ],
            byCustomer: [
                { name: 'Acme Corp', amount: 850000, percentage: 34 },
                { name: 'Global Tech', amount: 620000, percentage: 24.8 },
                { name: 'Stark Ind', amount: 450000, percentage: 18 },
                { name: 'Wayne Ent', amount: 320000, percentage: 12.8 },
                { name: 'Others', amount: 260000, percentage: 10.4 },
            ],
            byProduct: [
                { name: 'Consulting', amount: 1200000 },
                { name: 'Software Lic', amount: 800000 },
                { name: 'Support', amount: 500000 }
            ]
        };
    }

    async getExpenseAnalysis() {
        await delay(500);

        return {
            totalExpense: 1100000,
            breakdown: [
                { category: 'Salaries', amount: 600000, percentage: 54.5 },
                { category: 'Rent', amount: 150000, percentage: 13.6 },
                { category: 'Software', amount: 120000, percentage: 10.9 },
                { category: 'Utilities', amount: 80000, percentage: 7.2 },
                { category: 'Travel', amount: 150000, percentage: 13.6 }
            ],
            topVendors: [
                { name: 'AWS', amount: 85000 },
                { name: 'WeWork', amount: 150000 },
                { name: 'Dell', amount: 250000 },
            ]
        };
    }

    async getBalanceSheet(asOfDate) {
        await delay(500);

        const assets = ledgers.filter(l => l.category === 'Asset');
        const liabilities = ledgers.filter(l => l.category === 'Liability');
        const equity = ledgers.filter(l => l.category === 'Equity');

        const totalAssets = assets.reduce((sum, l) => sum + l.balance, 0);
        const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
        const totalEquity = equity.reduce((sum, l) => sum + l.balance, 0);

        return {
            assets: { total: totalAssets, items: assets },
            liabilities: { total: totalLiabilities, items: liabilities },
            equity: { total: totalEquity, items: equity }
        };
    }

    async getTrialBalance(asOfDate) {
        await delay(500);
        return ledgers.map(l => ({
            account: l.account,
            debit: l.balance > 0 ? l.balance : 0, // Simplified assumption
            credit: l.balance < 0 ? Math.abs(l.balance) : 0
        }));
    }
}

export const reportService = new ReportService();
