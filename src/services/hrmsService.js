// Updated: 2025-12-27
import { employees, attendance, leaves, payroll, performance, documents, hrmsMetrics } from './hrmsMockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class HRMSService {
    async getDashboardMetrics() {
        await delay(500);
        return hrmsMetrics;
    }

    async getEmployees() {
        await delay(600);
        return [...employees];
    }

    async getEmployeeById(id) {
        await delay(300);
        return employees.find(e => e.id === id) || null;
    }

    async createEmployee(data) {
        await delay(800);
        const newEmployee = {
            id: `EMP-${Math.floor(Math.random() * 1000) + 100}`,
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0],
            avatar: '/avatars/default.png',
            ...data
        };
        employees.push(newEmployee);
        return newEmployee;
    }

    async getAttendance(filters = {}) {
        await delay(400);
        // Filter logic can be added here
        return [...attendance];
    }

    async getLeaves() {
        await delay(400);
        return [...leaves];
    }

    async getLeavesByEmployee(employeeId) {
        await delay(300);
        return leaves.filter(l => l.employeeId === employeeId);
    }

    async createLeaveRequest(data) {
        await delay(500);
        const newLeave = {
            id: `LEAVE-${Math.floor(Math.random() * 10000)}`,
            status: 'Pending',
            ...data
        };
        leaves.unshift(newLeave);
        return newLeave;
    }

    async getPayroll() {
        await delay(400);
        return [...payroll];
    }

    async getPayrollByEmployee(employeeId) {
        await delay(300);
        return payroll.filter(p => p.employeeId === employeeId);
    }

    async getPerformanceReviews(employeeId = null) {
        await delay(400);
        if (employeeId) {
            return performance.filter(p => p.employeeId === employeeId);
        }
        return [...performance];
    }

    async getDocuments(employeeId) {
        await delay(300);
        return documents.filter(d => d.employeeId === employeeId);
    }

    async createAttendanceLog(data) {
        await delay(500);
        const newLog = {
            id: `ATT-${Math.floor(Math.random() * 10000)}`,
            ...data
        };
        attendance.unshift(newLog);
        return newLog;
    }

    async createPerformanceReview(data) {
        await delay(600);
        const newReview = {
            id: `PERF-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString().split('T')[0],
            ...data
        };
        performance.unshift(newReview);
        return newReview;
    }
}

export const hrmsService = new HRMSService();
