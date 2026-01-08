// Updated: 2025-12-27
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const rolePermissions = {
    admin: [
        'dashboard.view',
        'accounting.view', 'accounting.create', 'accounting.edit', 'accounting.delete',
        'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete',
        'payments.view', 'payments.create', 'payments.edit',
        'ledgers.view', 'ledgers.create',
        'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
        'reports.view',
        'crm.view', 'crm.create', 'crm.edit', 'crm.delete',
        'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
        'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
        'quotations.view', 'quotations.create', 'quotations.edit', 'quotations.delete', // Added quotations permissions
        'contracts.view', 'contracts.create', 'contracts.edit', 'contracts.delete', // Added contracts permissions
        'activities.view', 'activities.create', 'activities.edit', 'activities.delete',
        'tasks.view', 'tasks.create', 'tasks.edit', 'tasks.delete',
        'communications.view', 'communications.create', 'communications.edit', 'communications.delete',
        'hrms.view', 'hrms.create', 'hrms.edit', 'hrms.delete',
        'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
        'attendance.view', 'attendance.create', 'attendance.edit',
        'leaves.view', 'leaves.create', 'leaves.edit', // Added leaves
        'payroll.view', 'payroll.create', 'payroll.edit',
        'performance.view', 'performance.create', 'performance.edit', // Added performance
        'hrms_reports.view', // Added reports
        'pos.view', 'pos.create',
        'billing.view', 'billing.create',
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'sessions.view', 'sessions.edit',
        'returns.view', 'returns.create',
        'pos_reports.view',
        'invoices.view', 'invoices.edit', 'invoices.delete',
        'admin.view', 'admin.create', 'admin.edit', 'admin.delete',
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
        'permissions.view', 'permissions.edit',
        'settings.view', 'settings.edit',
    ],
    manager: [
        'dashboard.view',
        'accounting.view', 'accounting.create', 'accounting.edit',
        'invoices.view', 'invoices.create', 'invoices.edit',
        'payments.view', 'payments.create',
        'ledgers.view',
        'expenses.view', 'expenses.create', 'expenses.edit',
        'reports.view',
        'crm.view', 'crm.create', 'crm.edit',
        'customers.view', 'customers.create', 'customers.edit',
        'leads.view', 'leads.create', 'leads.edit',
        'quotations.view', 'quotations.create', 'quotations.edit', // Manager permissions
        'contracts.view', 'contracts.create', 'contracts.edit',
        'activities.view', 'tasks.view', 'communications.view',
        'hrms.view',
        'employees.view',
        'attendance.view',
        'leaves.view',
        'payroll.view',
        'performance.view',
        'hrms_reports.view',
        'pos.view',
        'billing.view',
    ],
    accountant: [
        'dashboard.view',
        'accounting.view', 'accounting.create', 'accounting.edit',
        'invoices.view', 'invoices.create', 'invoices.edit',
        'payments.view', 'payments.create', 'payments.edit',
        'ledgers.view', 'ledgers.create',
        'expenses.view', 'expenses.create', 'expenses.edit',
        'reports.view',
    ],
    hr: [
        'dashboard.view',
        'hrms.view', 'hrms.create', 'hrms.edit',
        'employees.view', 'employees.create', 'employees.edit',
        'attendance.view', 'attendance.create', 'attendance.edit',
        'leaves.view', 'leaves.create', 'leaves.edit',
        'payroll.view', 'payroll.create', 'payroll.edit',
        'performance.view', 'performance.create', 'performance.edit',
        'hrms_reports.view',
    ],
    sales: [
        'dashboard.view',
        'crm.view', 'crm.create', 'crm.edit',
        'customers.view', 'customers.create', 'customers.edit',
        'leads.view', 'leads.create', 'leads.edit',
        'quotations.view', 'quotations.create', 'quotations.edit', // Sales permissions
        'contracts.view', 'contracts.create', 'contracts.edit',
        'activities.view', 'activities.create', 'activities.edit',
        'tasks.view', 'tasks.create', 'tasks.edit',
        'communications.view', 'communications.create', 'communications.edit',
        'invoices.view', 'invoices.create',
        'reports.view',
    ],
    cashier: [
        'dashboard.view',
        'pos.view', 'pos.create',
        'billing.view', 'billing.create',
        'customers.view', 'customers.create',
        'invoices.view', 'invoices.edit', 'invoices.delete',
        'payments.view', 'payments.create',
        'sessions.view',
        'returns.view',
    ],
    viewer: [
        'dashboard.view',
        'accounting.view',
        'invoices.view',
        'payments.view',
        'ledgers.view',
        'expenses.view',
        'reports.view',
        'crm.view',
        'customers.view',
        'leads.view',
        'quotations.view', // Viewer permissions
        'contracts.view',
        'activities.view',
        'tasks.view',
        'communications.view',
        'hrms.view',
        'employees.view',
        'attendance.view',
        'payroll.view',
        'leaves.view',
        'performance.view',
        'hrms_reports.view',
        'pos.view',
        'billing.view',
    ],
    employee: [
        'dashboard.view',
        'hrms.view',
        'attendance.view',
        'leaves.view', 'leaves.create',
        'payroll.view',
        'performance.view',
    ],
};
const mockUsers = {
    admin: {
        id: '1',
        name: 'Admin User',
        email: 'admin@erp.com',
        role: 'admin',
        employeeId: 'EMP-001',
        isManager: false,
        roles: ['admin', 'hr_admin']
    },
    manager: {
        id: '2',
        name: 'Manager User',
        email: 'manager@erp.com',
        role: 'manager',
        employeeId: 'EMP-002',
        isManager: true,
        roles: ['manager']
    },
    accountant: {
        id: '3',
        name: 'Accountant User',
        email: 'accountant@erp.com',
        role: 'accountant',
        employeeId: 'EMP-003',
        isManager: false,
        roles: ['accountant']
    },
    hr: {
        id: '4',
        name: 'HR Manager',
        email: 'hr@erp.com',
        role: 'hr',
        employeeId: 'EMP-004',
        isManager: true,
        roles: ['hr_admin', 'manager']
    },
    sales: {
        id: '5',
        name: 'Sales User',
        email: 'sales@erp.com',
        role: 'sales',
        employeeId: 'EMP-005',
        isManager: false,
        roles: ['sales']
    },
    cashier: {
        id: '6',
        name: 'Cashier User',
        email: 'cashier@erp.com',
        role: 'cashier',
        employeeId: 'EMP-006',
        isManager: false,
        roles: ['cashier']
    },
    viewer: {
        id: '7',
        name: 'Viewer User',
        email: 'viewer@erp.com',
        role: 'viewer',
        employeeId: 'EMP-007',
        isManager: false,
        roles: ['viewer']
    },
    employee: {
        id: '8',
        name: 'John Employee',
        email: 'employee@erp.com',
        role: 'employee',
        employeeId: 'EMP-101',
        isManager: false,
        roles: ['employee']
    },
};
export const useAuthStore = create()(persist((set, get) => ({
    user: null,
    isAuthenticated: false,
    token: null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:5050/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Login failed');
            }

            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                isLoading: false,
            });
            return data.user;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5050/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                set({ user: data.user, isAuthenticated: true });
            } else {
                get().logout();
            }
        } catch {
            get().logout();
        }
    },

    hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        // Admin always has all permissions
        if (user.role === 'admin') return true;
        return user.permissions?.includes(permission) ?? false;
    },

    hasAnyPermission: (permissions) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === 'admin') return true;
        return permissions.some(p => user.permissions?.includes(p)) ?? false;
    },
}), {
    name: 'erp-auth-storage',
}));
