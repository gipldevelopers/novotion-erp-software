import { gstReturns, tdsRecords, taxRegistry } from './taxationMockData';
import { accountingInvoices, expenses } from './accountingMockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class TaxationService {
    // GST Methods
    async getFiledReturns() {
        await delay(300);
        return [...gstReturns];
    }

    async getGSTR1Data(month, year) {
        await delay(600);

        // Filter invoices for the specific month/year
        const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS Date? adjusting later
        // Assuming input month is 1-12
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;

        const start = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
        const end = new Date(new Date(`${nextYear}-${String(nextMonth).padStart(2, '0')}-01`) - 1);

        const relevantInvoices = accountingInvoices.filter(inv => {
            const d = new Date(inv.createdAt);
            return d >= start && d <= end;
        });

        // B2B: Invoices with GSTIN
        const b2b = relevantInvoices.filter(inv => inv.customerGstin);
        // B2C Large: Invoices > 2.5L and inter-state (mock logic)
        const b2cl = relevantInvoices.filter(inv => !inv.customerGstin && inv.amount > 250000);
        // B2C Small: The rest
        const b2cs = relevantInvoices.filter(inv => !inv.customerGstin && inv.amount <= 250000);

        return {
            period: `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`,
            summary: {
                totalTaxableValue: relevantInvoices.reduce((sum, i) => sum + (i.amount / 1.18), 0), // Mock calc
                totalTaxLiability: relevantInvoices.reduce((sum, i) => sum + (i.amount - (i.amount / 1.18)), 0),
                b2bCount: b2b.length,
                b2clCount: b2cl.length,
                b2csCount: b2cs.length
            },
            details: { b2b, b2cl, b2cs } // Pass full lists for tables
        };
    }

    async getGSTR3BData(month, year) {
        await delay(600);

        // Similar filter logic
        // Simplified for mock

        const gstr1 = await this.getGSTR1Data(month, year);
        const totalOutputTax = gstr1.summary.totalTaxLiability;

        // Input Tax Credit from Expenses
        const totalITC = expenses.reduce((sum, exp) => sum + (exp.gstAmount || 0), 0); // Simplified: taking all expenses for now

        return {
            period: gstr1.period,
            outwardSupplies: {
                taxableValue: gstr1.summary.totalTaxableValue,
                igst: totalOutputTax * 0.5, // Mock split
                cgst: totalOutputTax * 0.25,
                sgst: totalOutputTax * 0.25,
                cess: 0
            },
            itc: {
                igst: totalITC * 0.5,
                cgst: totalITC * 0.25,
                sgst: totalITC * 0.25,
                cess: 0
            },
            payment: {
                taxPayable: Math.max(0, totalOutputTax - totalITC)
            }
        };
    }

    // TDS Methods
    async getTDSRecords(params = {}) {
        await delay(300);
        let records = [...tdsRecords];
        // Filter logic if needed
        return records;
    }

    async createTDSPayment(data) {
        await delay(500);
        const newRecord = {
            id: `TDS-${Date.now()}`,
            status: 'pending',
            ...data
        };
        tdsRecords.push(newRecord);
        return newRecord;
    }

    // Global Tax Registry Methods
    async getTaxRegistry() {
        await delay(300);
        return [...taxRegistry];
    }

    async addTaxRate(data) {
        await delay(400);
        const newTax = {
            id: `TAX-${Date.now()}`,
            status: 'active',
            ...data
        };
        taxRegistry.push(newTax);
        return newTax;
    }

    async updateTaxRate(id, data) {
        await delay(400);
        const index = taxRegistry.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Tax rate not found');
        taxRegistry[index] = { ...taxRegistry[index], ...data };
        return taxRegistry[index];
    }

    async deleteTaxRate(id) {
        await delay(300);
        const index = taxRegistry.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Tax rate not found');
        taxRegistry.splice(index, 1);
        return { success: true };
    }
}

export const taxationService = new TaxationService();
