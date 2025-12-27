import { customers, leads, activities, tasks, communications, kpimetrics, invoices, payments } from './crmMockData';

// Simulating API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class CRMService {
    async getDashboardMetrics() {
        await delay(500);
        return kpimetrics;
    }

    async getCustomers() {
        await delay(600);
        return [...customers];
    }

    async getCustomerById(id) {
        await delay(300);
        return customers.find(c => c.id === id) || null;
    }

    async createCustomer(customerData) {
        await delay(800);
        const newCustomer = {
            id: `CUST-${Math.floor(Math.random() * 1000)}`,
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0],
            totalSpent: 0,
            ...customerData,
        };
        // In a real app we'd push to the array, but here we just return it
        // customers.push(newCustomer); 
        return newCustomer;
    }

    async getLeads() {
        await delay(600);
        return [...leads];
    }

    async getLeadById(id) {
        await delay(300);
        return leads.find(l => l.id === id) || null;
    }

    async updateLeadStage(id, stage) {
        await delay(400);
        const lead = leads.find(l => l.id === id);
        if (lead) {
            lead.stage = stage;
            return { ...lead };
        }
        return null;
    }

    async createLead(leadData) {
        await delay(700);
        const newLead = {
            id: `LEAD-${Math.floor(Math.random() * 1000)}`,
            createdAt: new Date().toISOString().split('T')[0],
            assignedTo: 'Admin User',
            ...leadData,
        };
        return newLead;
    }

    async createTask(taskData) {
        await delay(500);
        const newTask = {
            id: `TASK-${Math.floor(Math.random() * 1000)}`,
            status: 'Not Started',
            ...taskData,
        };
        tasks.push(newTask);
        return newTask;
    }

    async updateTask(id, updates) {
        await delay(400);
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            return tasks[index];
        }
        return null;
    }

    async createActivity(activityData) {
        await delay(500);
        const newActivity = {
            id: `ACT-${Math.floor(Math.random() * 1000)}`,
            status: 'Scheduled',
            ...activityData,
        };
        activities.push(newActivity);
        return newActivity;
    }

    async updateActivity(id, updates) {
        await delay(400);
        const index = activities.findIndex(a => a.id === id);
        if (index !== -1) {
            activities[index] = { ...activities[index], ...updates };
            return activities[index];
        }
        return null;
    }

    async getActivities(customerId = null) {
        await delay(400);
        if (customerId) {
            // Simply match based on a mock convention if we had it, or return all for now to populate UI
            const custActivities = activities.filter(a => a.description.includes('Customer') || Math.random() > 0.5);
            return custActivities.length > 0 ? custActivities : activities.slice(0, 2);
        }
        return [...activities];
    }

    async getTasks() {
        await delay(400);
        return [...tasks];
    }

    async getCommunications() {
        await delay(400);
        return [...communications];
    }

    async getInvoicesByCustomer(customerId) {
        await delay(300);
        return invoices.filter(inv => inv.customerId === customerId);
    }

    async getPaymentsByCustomer(customerId) {
        await delay(300);
        return payments.filter(pay => pay.customerId === customerId);
    }
    async sendEmail(emailData) {
        await delay(600);
        const newEmail = {
            id: `COMM-${Math.floor(Math.random() * 10000)}`,
            type: 'Email',
            read: true,
            date: new Date().toISOString(),
            from: 'me@company.com', // Simulate sending from current user
            ...emailData,
        };
        // Add to beginning of array to simulate latest first
        communications.unshift(newEmail);
        return newEmail;
    }
}

export const crmService = new CRMService();
