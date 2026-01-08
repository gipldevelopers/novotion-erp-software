import {
    employees as seedEmployees,
    attendance as seedAttendance,
    leaves as seedLeaves,
    payroll as seedPayroll,
    performance as seedPerformance,
    documents as seedDocuments,
} from './hrmsMockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const STORE_KEY = 'novotion_hrms_store_v1';

const todayISO = () => new Date().toISOString().split('T')[0];

const safeParseJson = (value) => {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const normalizeText = (value) => String(value || '').trim();

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const uniqueStrings = (values) => Array.from(new Set(values.map((v) => normalizeText(v)).filter(Boolean)));

const defaultOnboardingTasks = () => ([
    { id: 'offer-accepted', title: 'Offer accepted', done: true },
    { id: 'kyc-collected', title: 'KYC collected', done: false },
    { id: 'nda-signed', title: 'NDA signed', done: false },
    { id: 'account-created', title: 'Account created', done: false },
    { id: 'assets-assigned', title: 'Assets assigned', done: false },
]);

class HRMSService {
    constructor() {
        this._db = null;
        this._loaded = false;
    }

    _isBrowser() {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    }

    _deepClone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    _seedDb() {
        const employeeDepartmentNames = uniqueStrings(seedEmployees.map((e) => e.department));
        const employeeRoleNames = uniqueStrings(seedEmployees.map((e) => e.designation));

        const departments = uniqueStrings([
            ...employeeDepartmentNames,
            'Engineering',
            'Product',
            'Sales',
            'Marketing',
            'HR',
            'Finance',
        ]).map((name) => ({ id: makeId('DEPT'), name }));

        const jobRoles = uniqueStrings(employeeRoleNames).map((name) => ({ id: makeId('ROLE'), name }));

        return {
            employees: this._deepClone(seedEmployees).map((e) => ({
                ...e,
                status: e.status || 'Active',
                joinDate: e.joinDate || todayISO(),
                onboarding: e.onboarding || { tasks: defaultOnboardingTasks(), completedAt: null },
                exit: e.exit || null,
            })),
            attendance: this._deepClone(seedAttendance),
            leaves: this._deepClone(seedLeaves),
            payroll: this._deepClone(seedPayroll),
            performance: this._deepClone(seedPerformance),
            documents: this._deepClone(seedDocuments).map((d) => ({
                ...d,
                dataUrl: d.dataUrl || null,
                mimeType: d.mimeType || null,
            })),
            departments,
            jobRoles,
        };
    }

    _loadDb() {
        if (this._loaded) return;
        this._loaded = true;

        const seed = this._seedDb();
        if (!this._isBrowser()) {
            this._db = seed;
            return;
        }

        const raw = window.localStorage.getItem(STORE_KEY);
        const parsed = raw ? safeParseJson(raw) : null;
        if (!parsed || typeof parsed !== 'object') {
            this._db = seed;
            window.localStorage.setItem(STORE_KEY, JSON.stringify(this._db));
            return;
        }

        this._db = {
            ...seed,
            ...parsed,
        };

        this._persist();
    }

    _persist() {
        if (!this._isBrowser() || !this._db) return;
        window.localStorage.setItem(STORE_KEY, JSON.stringify(this._db));
    }

    _requireDb() {
        this._loadDb();
        return this._db;
    }

    _findEmployeeIndexById(id) {
        const db = this._requireDb();
        return db.employees.findIndex((e) => e.id === id);
    }

    _getEmployeeByIdUnsafe(id) {
        const db = this._requireDb();
        return db.employees.find((e) => e.id === id) || null;
    }

    _getToken() {
        if (!this._isBrowser()) return null;
        const storage = window.localStorage.getItem('erp-auth-storage');
        if (!storage) return null;
        try {
            const parsed = JSON.parse(storage);
            return parsed.state?.token;
        } catch {
            return null;
        }
    }

    async getDashboardMetrics() {
        const token = this._getToken();
        if (token) {
            try {
                const response = await fetch('http://localhost:5050/api/hrms/dashboard/metrics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) return data.metrics;
            } catch (error) {
                console.error('API Dash fetch failed, falling back to mock', error);
            }
        }

        await delay(300);
        const db = this._requireDb();

        const totalEmployees = db.employees.length;
        const activeEmployees = db.employees.filter((e) => e.status === 'Active' || e.status === 'Probation' || e.status === 'Onboarding' || e.status === 'Notice Period').length;
        const onLeaveToday = 0;
        const newHiresThisMonth = db.employees.filter((e) => {
            if (!e.joinDate) return false;
            const dt = new Date(e.joinDate);
            const now = new Date();
            return dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth();
        }).length;

        const deptCounts = db.employees.reduce((acc, e) => {
            const dept = normalizeText(e.department) || 'Unassigned';
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {});

        const departmentHeadcount = Object.entries(deptCounts).map(([name, value]) => ({ name, value }));

        const dayName = (dateISO) => {
            const d = new Date(dateISO);
            return d.toLocaleDateString(undefined, { weekday: 'short' });
        };

        const lastDays = Array.from({ length: 5 }, (_, idx) => {
            const d = new Date();
            d.setDate(d.getDate() - (4 - idx));
            const iso = d.toISOString().split('T')[0];
            const logs = db.attendance.filter((a) => a.date === iso);

            const counts = logs.reduce(
                (acc, log) => {
                    const s = String(log.status || '').toLowerCase();
                    if (s.includes('leave')) acc.leave += 1;
                    else if (s.includes('present')) acc.present += 1;
                    else acc.absent += 1;
                    return acc;
                },
                { present: 0, absent: 0, leave: 0 }
            );

            return { day: dayName(iso), ...counts };
        });

        return {
            totalEmployees,
            activeEmployees,
            onLeaveToday,
            newHiresThisMonth,
            departmentHeadcount,
            attendanceTrend: lastDays,
        };
    }

    async getEmployees() {
        const token = this._getToken();
        if (token) {
            try {
                const response = await fetch('http://localhost:5050/api/hrms/employees', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) return data.employees;
            } catch (error) {
                console.error('API Employees fetch failed, falling back to mock', error);
            }
        }
        await delay(250);
        const db = this._requireDb();
        return [...db.employees];
    }

    async getEmployeeById(id) {
        await delay(150);
        const db = this._requireDb();
        const emp = db.employees.find((e) => e.id === id) || null;
        return emp ? { ...emp } : null;
    }

    async createEmployee(data) {
        await delay(400);
        const db = this._requireDb();

        const newEmployee = {
            id: `EMP-${Math.floor(Math.random() * 1000) + 100}`,
            status: 'Onboarding',
            joinDate: todayISO(),
            avatar: '/avatars/default.png',
            onboarding: { tasks: defaultOnboardingTasks(), completedAt: null },
            exit: null,
            ...data,
        };

        if (newEmployee.manager === newEmployee.id) newEmployee.manager = '';

        db.employees.push(newEmployee);
        this._persist();
        return { ...newEmployee };
    }

    async updateEmployee(id, updates) {
        await delay(250);
        const db = this._requireDb();
        const index = this._findEmployeeIndexById(id);
        if (index === -1) return null;

        const next = { ...db.employees[index], ...updates };
        if (next.manager === id) next.manager = '';
        db.employees[index] = next;
        this._persist();
        return { ...next };
    }

    async setEmployeeStatus(id, status, details = {}) {
        await delay(200);
        const db = this._requireDb();
        const index = this._findEmployeeIndexById(id);
        if (index === -1) return null;

        db.employees[index] = { ...db.employees[index], status, ...details };
        this._persist();
        return { ...db.employees[index] };
    }

    async updateOnboardingTask(employeeId, taskId, done) {
        await delay(150);
        const db = this._requireDb();
        const index = this._findEmployeeIndexById(employeeId);
        if (index === -1) return null;

        const emp = db.employees[index];
        const onboarding = emp.onboarding || { tasks: defaultOnboardingTasks(), completedAt: null };
        const tasks = (onboarding.tasks || []).map((t) => (t.id === taskId ? { ...t, done: !!done } : t));
        const allDone = tasks.length > 0 && tasks.every((t) => t.done);
        const completedAt = allDone ? (onboarding.completedAt || todayISO()) : null;

        db.employees[index] = {
            ...emp,
            onboarding: { ...onboarding, tasks, completedAt },
        };
        this._persist();
        return { ...db.employees[index] };
    }

    async completeOnboarding(employeeId) {
        await delay(200);
        const emp = await this.getEmployeeById(employeeId);
        if (!emp) return null;
        const onboarding = emp.onboarding || { tasks: defaultOnboardingTasks(), completedAt: null };
        const tasks = (onboarding.tasks || defaultOnboardingTasks()).map((t) => ({ ...t, done: true }));
        return this.updateEmployee(employeeId, {
            status: 'Active',
            onboarding: { tasks, completedAt: todayISO() },
        });
    }

    async offboardEmployee(employeeId, payload) {
        await delay(250);
        const db = this._requireDb();
        const index = this._findEmployeeIndexById(employeeId);
        if (index === -1) return null;

        const status = payload?.status;
        if (status !== 'Resigned' && status !== 'Terminated') return null;

        const exit = {
            status,
            reason: normalizeText(payload?.reason),
            lastWorkingDay: payload?.lastWorkingDay || todayISO(),
            processedAt: todayISO(),
            notes: normalizeText(payload?.notes),
        };

        db.employees[index] = { ...db.employees[index], status, exit };
        this._persist();
        return { ...db.employees[index] };
    }

    async getAttendance(filters = {}) {
        await delay(200);
        const db = this._requireDb();
        const employeeId = filters?.employeeId;
        if (employeeId) return db.attendance.filter((a) => a.employeeId === employeeId);
        return [...db.attendance];
    }

    async createAttendanceLog(data) {
        await delay(250);
        const db = this._requireDb();
        const newLog = { id: makeId('ATT'), ...data };
        db.attendance.unshift(newLog);
        this._persist();
        return { ...newLog };
    }

    async getLeaves() {
        await delay(200);
        const db = this._requireDb();
        return [...db.leaves];
    }

    async getLeavesByEmployee(employeeId) {
        await delay(150);
        const db = this._requireDb();
        return db.leaves.filter((l) => l.employeeId === employeeId);
    }

    async createLeaveRequest(data) {
        await delay(250);
        const db = this._requireDb();
        const newLeave = { id: makeId('LEAVE'), status: 'Pending', ...data };
        db.leaves.unshift(newLeave);
        this._persist();
        return { ...newLeave };
    }

    async getPayroll() {
        await delay(200);
        const db = this._requireDb();
        return [...db.payroll];
    }

    async getPayrollByEmployee(employeeId) {
        await delay(150);
        const db = this._requireDb();
        return db.payroll.filter((p) => p.employeeId === employeeId);
    }

    async generatePayroll(month, year, employeeIds = []) {
        await delay(500);
        const db = this._requireDb();

        // Generate payroll for specified employees or all active employees
        const employees = employeeIds.length > 0
            ? db.employees.filter(e => employeeIds.includes(e.id))
            : db.employees.filter(e => e.status === 'Active');

        const newPayrolls = employees.map(emp => ({
            id: makeId('PAY'),
            employeeId: emp.id,
            month: `${year}-${String(month + 1).padStart(2, '0')}`,
            basicPay: 5000 + Math.random() * 5000,
            allowances: 1000 + Math.random() * 2000,
            deductions: 500 + Math.random() * 1000,
            netPay: 0,
            status: 'Pending',
            processedDate: null,
        }));

        // Calculate net pay
        newPayrolls.forEach(p => {
            p.netPay = p.basicPay + p.allowances - p.deductions;
        });

        db.payroll.push(...newPayrolls);
        this._persist();
        return newPayrolls;
    }

    async processPayroll(payrollId) {
        await delay(300);
        const db = this._requireDb();
        const index = db.payroll.findIndex(p => p.id === payrollId);

        if (index === -1) return null;

        db.payroll[index] = {
            ...db.payroll[index],
            status: 'Paid',
            processedDate: todayISO(),
        };

        this._persist();
        return { ...db.payroll[index] };
    }

    async getPerformanceReviews(employeeId = null) {
        await delay(200);
        const db = this._requireDb();
        if (employeeId) return db.performance.filter((p) => p.employeeId === employeeId);
        return [...db.performance];
    }

    async createPerformanceReview(data) {
        await delay(250);
        const db = this._requireDb();
        const newReview = { id: makeId('PERF'), date: todayISO(), ...data };
        db.performance.unshift(newReview);
        this._persist();
        return { ...newReview };
    }

    async getDocuments(employeeId) {
        await delay(150);
        const db = this._requireDb();
        return db.documents.filter((d) => d.employeeId === employeeId).map((d) => ({ ...d }));
    }

    async deleteDocument(documentId) {
        await delay(150);
        const db = this._requireDb();
        const idx = db.documents.findIndex((d) => d.id === documentId);
        if (idx === -1) return false;
        db.documents.splice(idx, 1);
        this._persist();
        return true;
    }

    async uploadDocument({ employeeId, file, type }) {
        await delay(200);
        const db = this._requireDb();
        if (!file || !employeeId) return null;

        const dataUrl = await new Promise((resolve, reject) => {
            if (typeof FileReader === 'undefined') return resolve(null);
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        }).catch(() => null);

        const doc = {
            id: makeId('DOC'),
            employeeId,
            name: file.name,
            type: normalizeText(type) || 'KYC',
            uploadDate: todayISO(),
            dataUrl,
            mimeType: file.type || null,
        };

        db.documents.unshift(doc);
        this._persist();
        return { ...doc };
    }

    async getDepartments() {
        await delay(100);
        const db = this._requireDb();
        return [...db.departments].map((d) => ({ ...d }));
    }

    async addDepartment(name) {
        await delay(150);
        const db = this._requireDb();
        const nextName = normalizeText(name);
        if (!nextName) return null;
        const exists = db.departments.some((d) => d.name.toLowerCase() === nextName.toLowerCase());
        if (exists) return null;
        const dept = { id: makeId('DEPT'), name: nextName };
        db.departments.push(dept);
        this._persist();
        return { ...dept };
    }

    async renameDepartment(departmentId, newName) {
        await delay(150);
        const db = this._requireDb();
        const idx = db.departments.findIndex((d) => d.id === departmentId);
        if (idx === -1) return null;
        const nextName = normalizeText(newName);
        if (!nextName) return null;
        const prevName = db.departments[idx].name;
        db.departments[idx] = { ...db.departments[idx], name: nextName };
        db.employees = db.employees.map((e) => (e.department === prevName ? { ...e, department: nextName } : e));
        this._persist();
        return { ...db.departments[idx] };
    }

    async getJobRoles() {
        await delay(100);
        const db = this._requireDb();
        return [...db.jobRoles].map((r) => ({ ...r }));
    }

    async addJobRole(name) {
        await delay(150);
        const db = this._requireDb();
        const nextName = normalizeText(name);
        if (!nextName) return null;
        const exists = db.jobRoles.some((r) => r.name.toLowerCase() === nextName.toLowerCase());
        if (exists) return null;
        const role = { id: makeId('ROLE'), name: nextName };
        db.jobRoles.push(role);
        this._persist();
        return { ...role };
    }

    async renameJobRole(roleId, newName) {
        await delay(150);
        const db = this._requireDb();
        const idx = db.jobRoles.findIndex((r) => r.id === roleId);
        if (idx === -1) return null;
        const nextName = normalizeText(newName);
        if (!nextName) return null;
        const prevName = db.jobRoles[idx].name;
        db.jobRoles[idx] = { ...db.jobRoles[idx], name: nextName };
        db.employees = db.employees.map((e) => (e.designation === prevName ? { ...e, designation: nextName } : e));
        this._persist();
        return { ...db.jobRoles[idx] };
    }

    // ============ NEW METHODS FOR ENHANCED HRMS ============

    // Clock In/Out
    async clockIn(data) {
        await delay(200);
        const db = this._requireDb();
        const today = todayISO();

        const clockInRecord = {
            id: makeId('CLOCK'),
            employeeId: data.employeeId,
            date: today,
            checkIn: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            checkOut: null,
            hours: 0,
            status: 'Present',
            location: data.location || null,
            workMode: data.workMode || 'office',
            device: data.device || 'web',
            ...data // Allow overriding defaults
        };

        db.attendance.unshift(clockInRecord);
        this._persist();
        return { ...clockInRecord };
    }

    async clockOut(data) {
        await delay(200);
        const db = this._requireDb();
        const today = todayISO();

        // Find today's clock-in record
        // If employeeId is provided, look for that employee's active session
        const recordIndex = db.attendance.findIndex(
            (a) => a.employeeId === data.employeeId && a.date === today && !a.checkOut
        );

        if (recordIndex === -1) return null;

        const checkOutTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const checkInTime = db.attendance[recordIndex].checkIn;

        // Calculate hours worked
        const checkIn = new Date(`2000-01-01T${checkInTime}`);
        const checkOut = new Date(`2000-01-01T${checkOutTime}`);
        const hours = (checkOut - checkIn) / (1000 * 60 * 60);

        db.attendance[recordIndex] = {
            ...db.attendance[recordIndex],
            checkOut: checkOutTime,
            hours: Math.max(0, hours).toFixed(2),
        };

        this._persist();
        return { ...db.attendance[recordIndex] };
    }

    async updateAttendance(id, updates) {
        await delay(300);
        const db = this._requireDb();
        const index = db.attendance.findIndex(a => a.id === id);

        if (index === -1) return null;

        // Update the record
        db.attendance[index] = {
            ...db.attendance[index],
            ...updates
        };

        // Recalculate hours if checkIn/checkOut changed
        const record = db.attendance[index];
        if (record.checkIn && record.checkOut) {
            const checkIn = new Date(`2000-01-01T${record.checkIn}`);
            const checkOut = new Date(`2000-01-01T${record.checkOut}`);
            const diffMs = checkOut - checkIn;
            // Handle cross-midnight if needed, but for now assuming same day or next day handling elsewhere
            // Simple hour diff
            let hours = diffMs / (1000 * 60 * 60);

            // Adjust for break deductions (1 hour if work > 6 hours)
            if (updates.breakDeduction !== undefined) {
                hours -= updates.breakDeduction;
            } else if (hours > 6) {
                hours -= 1;
            }

            // Apply manual adjustments (use update OR existing)
            const adjustment = updates.adjustmentHours !== undefined ? parseFloat(updates.adjustmentHours) : (parseFloat(record.adjustmentHours) || 0);
            hours += adjustment;

            // Store the merged adjustment back to the record if it wasn't in updates
            if (updates.adjustmentHours === undefined && record.adjustmentHours) {
                db.attendance[index].adjustmentHours = record.adjustmentHours;
            }

            db.attendance[index].hours = Math.max(0, hours).toFixed(2);
        }

        this._persist();
        return { ...db.attendance[index] };
    }

    // Leave Balance
    async getLeaveBalance(employeeId) {
        await delay(150);

        // Mock leave balance data
        const leaveTypes = [
            { type: 'Casual Leave', total: 12, used: 5, pending: 1 },
            { type: 'Sick Leave', total: 10, used: 2, pending: 0 },
            { type: 'Earned Leave', total: 15, used: 8, pending: 2 },
            { type: 'Emergency Leave', total: 5, used: 1, pending: 0 },
        ];

        return leaveTypes;
    }

    // Employee Dashboard Data
    async getMyDashboardData(employeeId) {
        await delay(300);
        const db = this._requireDb();
        const today = todayISO();

        const employee = db.employees.find((e) => e.id === employeeId);
        const todayAttendance = db.attendance.find((a) => a.employeeId === employeeId && a.date === today);
        const leaveBalance = await this.getLeaveBalance(employeeId);
        const recentLeaves = db.leaves.filter((l) => l.employeeId === employeeId).slice(0, 5);

        // Calculate this month's attendance
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthAttendance = db.attendance.filter((a) => {
            const date = new Date(a.date);
            return (
                a.employeeId === employeeId &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
            );
        });

        const presentDays = monthAttendance.filter((a) => a.status === 'Present').length;
        const totalDays = monthAttendance.length;

        // Recent activities
        const activities = [
            ...db.attendance
                .filter((a) => a.employeeId === employeeId)
                .slice(0, 3)
                .map((a) => ({
                    type: a.checkIn ? 'clock-in' : 'clock-out',
                    title: a.checkIn ? 'Clocked In' : 'Clocked Out',
                    description: `${a.checkIn || a.checkOut} - ${a.workMode || 'office'} mode`,
                    timestamp: a.date,
                })),
            ...recentLeaves.map((l) => ({
                type: l.status === 'Approved' ? 'leave-approved' : l.status === 'Rejected' ? 'leave-rejected' : 'leave-request',
                title: `Leave ${l.status}`,
                description: `${l.type} from ${l.startDate} to ${l.endDate}`,
                timestamp: l.startDate,
                badge: l.status,
            })),
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

        return {
            employee,
            isClockedIn: todayAttendance && todayAttendance.checkIn && !todayAttendance.checkOut,
            todayHours: todayAttendance?.hours || 0,
            clockInTime: todayAttendance?.checkIn || null,
            leaveBalance,
            monthAttendance: {
                present: presentDays,
                total: totalDays,
                percentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
            },
            pendingLeaves: recentLeaves.filter((l) => l.status === 'Pending').length,
            recentActivities: activities,
            upcomingLeaves: recentLeaves.filter((l) =>
                l.status === 'Approved' && new Date(l.startDate) > new Date()
            ),
        };
    }

    // Manager Dashboard Data
    async getManagerDashboardData(managerId) {
        await delay(300);
        const db = this._requireDb();
        const today = todayISO();

        const teamMembers = db.employees.filter((e) => e.manager === managerId);
        const teamIds = teamMembers.map((e) => e.id);

        const todayAttendance = db.attendance.filter((a) => teamIds.includes(a.employeeId) && a.date === today);
        const presentToday = todayAttendance.filter((a) => a.status === 'Present').length;

        const pendingLeaves = db.leaves.filter((l) => teamIds.includes(l.employeeId) && l.status === 'Pending');
        const onLeaveToday = db.leaves.filter((l) => {
            const start = new Date(l.startDate);
            const end = new Date(l.endDate);
            const now = new Date(today);
            return teamIds.includes(l.employeeId) && l.status === 'Approved' && start <= now && end >= now;
        }).length;

        return {
            teamSize: teamMembers.length,
            presentToday,
            onLeaveToday,
            absentToday: teamMembers.length - presentToday - onLeaveToday,
            pendingApprovals: pendingLeaves.length,
            teamMembers,
            pendingLeaveRequests: pendingLeaves,
            teamAttendance: todayAttendance,
        };
    }

    // Get Team Members
    async getTeamMembers(managerId) {
        await delay(150);
        const db = this._requireDb();
        return db.employees.filter((e) => e.manager === managerId);
    }

    // Approve/Reject Leave
    async approveLeave(leaveId, comments = '') {
        await delay(200);
        const db = this._requireDb();
        const idx = db.leaves.findIndex((l) => l.id === leaveId);
        if (idx === -1) return null;

        db.leaves[idx] = {
            ...db.leaves[idx],
            status: 'Approved',
            approverComments: comments,
            approvedAt: todayISO(),
        };

        this._persist();
        return { ...db.leaves[idx] };
    }

    async rejectLeave(leaveId, comments = '') {
        await delay(200);
        const db = this._requireDb();
        const idx = db.leaves.findIndex((l) => l.id === leaveId);
        if (idx === -1) return null;

        db.leaves[idx] = {
            ...db.leaves[idx],
            status: 'Rejected',
            approverComments: comments,
            rejectedAt: todayISO(),
        };

        this._persist();
        return { ...db.leaves[idx] };
    }

    // Payslips
    async getPayslips(employeeId) {
        await delay(200);
        const db = this._requireDb();
        return db.payroll.filter((p) => p.employeeId === employeeId);
    }

    // Attendance Calendar
    async getAttendanceCalendar(employeeId, month, year) {
        await delay(200);
        const db = this._requireDb();

        const attendanceData = db.attendance.filter((a) => {
            const date = new Date(a.date);
            return (
                a.employeeId === employeeId &&
                date.getMonth() === month &&
                date.getFullYear() === year
            );
        });

        return attendanceData;
    }

    // Holidays
    async getHolidays(year) {
        await delay(100);
        // Mock holiday data
        return [
            { date: `${year}-01-01`, name: 'New Year\'s Day', type: 'Public Holiday' },
            { date: `${year}-01-26`, name: 'Republic Day', type: 'Public Holiday' },
            { date: `${year}-08-15`, name: 'Independence Day', type: 'Public Holiday' },
            { date: `${year}-10-02`, name: 'Gandhi Jayanti', type: 'Public Holiday' },
            { date: `${year}-12-25`, name: 'Christmas', type: 'Public Holiday' },
        ];
    }
}

export const hrmsService = new HRMSService();
