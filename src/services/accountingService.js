// Updated: 2025-12-30
import { accountingInvoices, ledgers, expenses, chartOfAccounts, vendors, recurringInvoices, paymentGateways, gstRecords, tdsRecords, payments } from './accountingMockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class AccountingService {
    // Existing Invoice Methods
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

    // Ledger Methods
    async getLedgers() {
        await delay(300);
        return [...ledgers];
    }

    async getLedgerById(id) {
        await delay(200);
        return ledgers.find(l => l.id === id) || null;
    }

    async updateLedger(id, data) {
        await delay(400);
        const index = ledgers.findIndex(l => l.id === id);
        if (index !== -1) {
            ledgers[index] = { ...ledgers[index], ...data };
            return ledgers[index];
        }
        return null;
    }

    async getLedgerTransactions(ledgerId) {
        await delay(400);
        // Simulate transactions for the ledger
        return [
            { id: 'TRX-001', date: '2024-12-25', description: 'Opening Balance', debit: 0, credit: 0, balance: 15000 },
            { id: 'TRX-002', date: '2024-12-28', description: 'Client Payment - INV-2024-001', debit: 10000, credit: 0, balance: 25000 },
        ];
    }

    async postJournalEntry(data) {
        await delay(600);

        // 1. Create a "transaction" record (simplified)
        const journalEntry = {
            id: `JE-${Math.floor(Math.random() * 10000)}`,
            date: data.date || new Date().toISOString(),
            reference: data.reference || `JE-${Math.floor(Math.random() * 1000)}`,
            entries: data.entries, // Array of { account, debit, credit, description }
            createdAt: new Date().toISOString(),
        };

        // 2. Update ledger balances based on entries
        data.entries.forEach(entry => {
            const ledger = ledgers.find(l => l.account === entry.account);
            if (ledger) {
                const debit = parseFloat(entry.debit || 0);
                const credit = parseFloat(entry.credit || 0);

                // Simplified balance logic based on category
                if (['Assets', 'Expenses'].includes(ledger.category)) {
                    ledger.balance += (debit - credit);
                } else {
                    ledger.balance += (credit - debit);
                }
            }
        });

        return journalEntry;
    }

    // Expense Methods
    async getExpenses() {
        await delay(300);
        return [...expenses];
    }

    // Payment Methods
    async getPayments() {
        await delay(300);
        return [...payments];
    }

    // Payment & Ledger Methods
    async recordPayment(paymentData) {
        await delay(500);

        // 1. Create Payment Record
        const newPayment = {
            id: `PAY-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString(),
            status: 'completed',
            isReconciled: false,
            ...paymentData
        };

        // 2. Update Invoice Status
        if (paymentData.invoiceId) {
            const invoice = accountingInvoices.find(inv => inv.id === paymentData.invoiceId);
            if (invoice) {
                // Check if full or partial payment
                const totalPaid = (invoice.amountPaid || 0) + parseFloat(paymentData.amount);
                invoice.amountPaid = totalPaid;

                if (totalPaid >= invoice.amount) {
                    invoice.status = 'paid';
                } else {
                    invoice.status = 'partial';
                }
            }
        }

        // 3. Create Ledger Entries (Double Entry)
        // Debit: Bank/Cash Account
        // Credit: Accounts Receivable (or Customer/Invoice Account)

        // Find appropriate ledgers
        const bankLedger = ledgers.find(l => l.account === 'Bank Account') || ledgers[0];
        const receivablesLedger = ledgers.find(l => l.account === 'Accounts Receivable') ||
            ledgers.find(l => l.category === 'Assets'); // Fallback

        if (bankLedger && receivablesLedger) {
            // Debit Bank (Increase Asset)
            bankLedger.balance += parseFloat(paymentData.amount);

            // Credit Receivables (Decrease Asset)
            receivablesLedger.balance -= parseFloat(paymentData.amount);
        }

        return newPayment;
    }

    async getPaymentMethods() {
        return [
            { id: 'razorpay', name: 'Razorpay', type: 'Gateway' },
            { id: 'stripe', name: 'Stripe', type: 'Gateway' },
            { id: 'bank_transfer', name: 'Bank Transfer', type: 'Manual' },
            { id: 'cash', name: 'Cash', type: 'Manual' },
            { id: 'cheque', name: 'Cheque', type: 'Manual' }
        ];
    }

    // Chart of Accounts Methods
    async getChartOfAccounts() {
        await delay(300);
        return [...chartOfAccounts];
    }

    async getAccountById(id) {
        await delay(200);
        return chartOfAccounts.find(acc => acc.id === id) || null;
    }

    async createAccount(data) {
        await delay(500);
        const newAccount = {
            id: `ACC-${Math.floor(Math.random() * 10000)}`,
            code: data.code || `${Math.floor(Math.random() * 10000)}`,
            createdAt: new Date().toISOString(),
            balance: 0,
            isGroup: false,
            level: data.level || 2,
            ...data
        };
        chartOfAccounts.push(newAccount);
        return newAccount;
    }

    async updateAccount(id, data) {
        await delay(400);
        const index = chartOfAccounts.findIndex(acc => acc.id === id);
        if (index !== -1) {
            chartOfAccounts[index] = { ...chartOfAccounts[index], ...data };
            return chartOfAccounts[index];
        }
        return null;
    }

    async deleteAccount(id) {
        await delay(300);
        const index = chartOfAccounts.findIndex(acc => acc.id === id);
        if (index !== -1) {
            chartOfAccounts.splice(index, 1);
            return true;
        }
        return false;
    }

    // Vendor Methods
    async getVendors() {
        await delay(300);
        return [...vendors];
    }

    async getVendorById(id) {
        await delay(200);
        return vendors.find(v => v.id === id) || null;
    }

    async createVendor(data) {
        await delay(500);
        const newVendor = {
            id: `VEN-${String(vendors.length + 1).padStart(3, '0')}`,
            outstandingAmount: 0,
            totalTransactions: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            ...data
        };
        vendors.push(newVendor);
        return newVendor;
    }

    async updateVendor(id, data) {
        await delay(400);
        const index = vendors.findIndex(v => v.id === id);
        if (index !== -1) {
            vendors[index] = { ...vendors[index], ...data };
            return vendors[index];
        }
        return null;
    }

    // Recurring Invoice Methods
    async getRecurringInvoices() {
        await delay(300);
        return [...recurringInvoices];
    }

    async getRecurringInvoiceById(id) {
        await delay(200);
        return recurringInvoices.find(ri => ri.id === id) || null;
    }

    async createRecurringInvoice(data) {
        await delay(500);
        const newRecurring = {
            id: `REC-${String(recurringInvoices.length + 1).padStart(3, '0')}`,
            status: 'active',
            autoSend: false,
            createdAt: new Date().toISOString(),
            ...data
        };
        recurringInvoices.push(newRecurring);
        return newRecurring;
    }

    async updateRecurringInvoice(id, data) {
        await delay(400);
        const index = recurringInvoices.findIndex(ri => ri.id === id);
        if (index !== -1) {
            recurringInvoices[index] = { ...recurringInvoices[index], ...data };
            return recurringInvoices[index];
        }
        return null;
    }

    // Payment Gateway Methods
    async getPaymentGateways() {
        await delay(300);
        return [...paymentGateways];
    }

    async getPaymentGatewayById(id) {
        await delay(200);
        return paymentGateways.find(pg => pg.id === id) || null;
    }

    async updatePaymentGateway(id, data) {
        await delay(400);
        const index = paymentGateways.findIndex(pg => pg.id === id);
        if (index !== -1) {
            paymentGateways[index] = { ...paymentGateways[index], ...data };
            return paymentGateways[index];
        }
        return null;
    }

    // GST Methods
    async getGSTRecords(params = {}) {
        await delay(300);
        let records = [...gstRecords];

        if (params.startDate && params.endDate) {
            records = records.filter(r => {
                const invoiceDate = new Date(r.invoiceDate);
                return invoiceDate >= new Date(params.startDate) && invoiceDate <= new Date(params.endDate);
            });
        }

        return records;
    }

    async generateGSTR1(period) {
        await delay(500);
        const records = await this.getGSTRecords(period);

        return {
            period,
            b2b: records.filter(r => r.type === 'B2B'),
            b2c: records.filter(r => r.type === 'B2C'),
            totalTaxable: records.reduce((sum, r) => sum + r.taxableAmount, 0),
            totalTax: records.reduce((sum, r) => sum + r.totalTax, 0),
        };
    }

    async generateGSTR3B(period) {
        await delay(500);
        const records = await this.getGSTRecords(period);

        const outwardSupplies = records.reduce((sum, r) => sum + r.taxableAmount, 0);
        const outputTax = records.reduce((sum, r) => sum + r.totalTax, 0);

        return {
            period,
            outwardSupplies,
            outputTax,
            inputTaxCredit: 0, // Would be calculated from expenses
            taxPayable: outputTax,
        };
    }

    // TDS Methods
    async getTDSRecords(params = {}) {
        await delay(300);
        let records = [...tdsRecords];

        if (params.startDate && params.endDate) {
            records = records.filter(r => {
                const paymentDate = new Date(r.paymentDate);
                return paymentDate >= new Date(params.startDate) && paymentDate <= new Date(params.endDate);
            });
        }

        return records;
    }

    async createTDSRecord(data) {
        await delay(400);
        const newTDS = {
            id: `TDS-${String(tdsRecords.length + 1).padStart(3, '0')}`,
            status: 'pending',
            ...data
        };
        tdsRecords.push(newTDS);
        return newTDS;
    }
}

export const accountingService = new AccountingService();
