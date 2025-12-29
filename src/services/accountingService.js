// Updated: 2025-12-27
import { accountingInvoices, ledgers, expenses } from './accountingMockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class AccountingService {
    async getInvoices() {
        await delay(300);
        return [...accountingInvoices];
    }

    async getInvoiceById(id) {
        await delay(200);
        return accountingInvoices.find(inv => inv.id === id) || null;
    }

    async createInvoice(data) {
        await delay(500);
        const newInvoice = {
            id: `INV-${Math.floor(Math.random() * 10000)}`,
            number: `INV-2024-${Math.floor(Math.random() * 1000)}`,
            createdAt: new Date().toISOString(),
            status: 'pending',
            ...data
        };
        accountingInvoices.unshift(newInvoice);
        return newInvoice;
    }

    async recordPosSale(saleData) {
        await delay(400);
        const newInvoice = {
            id: saleData.id || `INV-POS-${Math.floor(Math.random() * 10000)}`,
            number: saleData.invoiceNumber || `INV-P-${Math.floor(Math.random() * 1000)}`,
            customer: saleData.customerName || 'Walk-in Client',
            amount: saleData.total,
            status: 'paid',
            dueDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            source: 'pos',
            items: saleData.items
        };
        accountingInvoices.unshift(newInvoice);

        // Update Sales Revenue ledger
        const salesLedger = ledgers.find(l => l.account === 'Sales Revenue');
        if (salesLedger) {
            salesLedger.balance += saleData.total;
        }

        return newInvoice;
    }

    async getLedgers() {
        await delay(300);
        return [...ledgers];
    }

    async getExpenses() {
        await delay(300);
        return [...expenses];
    }
}

export const accountingService = new AccountingService();
