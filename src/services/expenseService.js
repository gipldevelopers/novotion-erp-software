import { expenseCategories, expenseRecords } from './expenseMockData';
import { vendors } from './accountingMockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class ExpenseService {
    async getCategories() {
        await delay(200);
        return [...expenseCategories];
    }

    async getExpenses(params = {}) {
        await delay(500);
        let results = [...expenseRecords];

        // Mock Filtering
        if (params.status && params.status !== 'all') {
            results = results.filter(e => e.status === params.status);
        }

        if (params.search) {
            const searchLower = params.search.toLowerCase();
            results = results.filter(e =>
                e.description.toLowerCase().includes(searchLower) ||
                e.id.toLowerCase().includes(searchLower) ||
                e.category.toLowerCase().includes(searchLower)
            );
        }

        return results;
    }

    async getExpenseById(id) {
        await delay(300);
        return expenseRecords.find(e => e.id === id) || null;
    }

    async createExpense(data) {
        await delay(800);

        // Calculate GST if not provided but category exists
        let gstAmount = data.gstAmount || 0;
        let totalAmount = data.totalAmount || data.amount;

        if (!gstAmount && data.category) {
            const category = expenseCategories.find(c => c.name === data.category);
            if (category && category.gstRate > 0) {
                // Assuming amount is exclusive of tax
                gstAmount = (data.amount * category.gstRate) / 100;
                totalAmount = parseFloat(data.amount) + gstAmount;
            }
        }

        const newExpense = {
            id: `EXP-2025-${Math.floor(Math.random() * 10000)}`,
            createdAt: new Date().toISOString(),
            status: 'pending', // Default to approval workflow
            paymentStatus: 'unpaid',
            gstAmount,
            totalAmount,
            ...data
        };

        expenseRecords.unshift(newExpense);
        return newExpense;
    }

    async updateExpense(id, data) {
        await delay(400);
        const index = expenseRecords.findIndex(e => e.id === id);
        if (index !== -1) {
            expenseRecords[index] = { ...expenseRecords[index], ...data };
            return expenseRecords[index];
        }
        return null;
    }

    async approveExpense(id, approverName) {
        await delay(500);
        return this.updateExpense(id, {
            status: 'approved',
            approvedBy: approverName,
            approvalDate: new Date().toISOString()
        });
    }

    async rejectExpense(id, reason) {
        await delay(500);
        return this.updateExpense(id, {
            status: 'rejected',
            rejectionReason: reason
        });
    }

    async getVendorExpenses(vendorId) {
        await delay(300);
        return expenseRecords.filter(e => e.vendorId === vendorId);
    }
}

export const expenseService = new ExpenseService();
