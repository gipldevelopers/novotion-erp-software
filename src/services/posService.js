import { services, clients, invoices, sessions, serviceCategories } from './posMockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class PosService {
    async getProducts(category = 'all') {
        await delay(300);
        if (category === 'all') return [...services];
        return services.filter(p => p.category === category);
    }

    async getCategories() {
        await delay(200);
        return [...serviceCategories];
    }

    async getCustomers() {
        await delay(300);
        return [...clients];
    }

    async createCustomer(data) {
        await delay(400);
        const newCustomer = {
            id: `CLT-${Math.floor(Math.random() * 10000)}`,
            balance: 0,
            totalSpent: 0,
            ...data
        };
        clients.push(newCustomer);
        return newCustomer;
    }

    async getActiveSession() {
        await delay(200);
        return sessions.find(s => s.status === 'open') || null;
    }

    async getAllSessions() {
        await delay(400);
        return [...sessions];
    }

    async openSession(openingCash) {
        await delay(500);
        const newSession = {
            id: `SES-${Math.floor(Math.random() * 10000)}`,
            userId: 'admin',
            userName: 'Current User',
            openedAt: new Date().toISOString(),
            closedAt: null,
            openingCash: Number(openingCash),
            closingCash: null,
            expectedCash: null,
            variance: null,
            status: 'open',
            invoiceCount: 0,
            totalSales: 0
        };
        sessions.unshift(newSession);
        return newSession;
    }

    async closeSession(sessionId, closingCash) {
        await delay(500);
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            session.closedAt = new Date().toISOString();
            session.closingCash = Number(closingCash);
            session.expectedCash = session.openingCash + session.totalSales;
            session.variance = session.closingCash - session.expectedCash;
            session.status = 'closed';
        }
        return session;
    }

    async processSale(invoiceData) {
        await delay(800);
        const newInvoice = {
            id: `INV-${Math.floor(Math.random() * 100000)}`,
            invoiceNumber: `INV-2024-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString(),
            status: 'paid',
            ...invoiceData
        };
        invoices.unshift(newInvoice);
        return newInvoice;
    }

    async getOrders() {
        await delay(400);
        return [...invoices];
    }
}

export const posService = new PosService();
