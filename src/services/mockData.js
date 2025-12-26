export const mockEmployees = [
    {
        id: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '555-0101',
        designation: 'Software Engineer',
        department: 'Engineering',
        joinDate: '2023-01-15',
        status: 'Active',
        role: 'EMPLOYEE',
        managerId: 'EMP003',
    },
    {
        id: 'EMP002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '555-0102',
        designation: 'HR Specialist',
        department: 'Human Resources',
        joinDate: '2023-02-20',
        status: 'Active',
        role: 'HR_ADMIN',
        managerId: 'EMP003',
    },
    {
        id: 'EMP003',
        firstName: 'Robert',
        lastName: 'Manager',
        email: 'robert.manager@company.com',
        phone: '555-0103',
        designation: 'Engineering Manager',
        department: 'Engineering',
        joinDate: '2022-05-10',
        status: 'Active',
        role: 'MANAGER',
        managerId: null,
    }
];

export const mockDepartments = [
    { id: 1, name: 'Engineering', description: 'Tech team' },
    { id: 2, name: 'Human Resources', description: 'HR team' },
    { id: 3, name: 'Sales', description: 'Sales team' },
];

export const mockDesignations = [
    { id: 1, title: 'Software Engineer' },
    { id: 2, title: 'HR Specialist' },
    { id: 3, title: 'Engineering Manager' },
    { id: 4, title: 'Sales Representative' },
];

export const mockLeaves = [
    {
        id: 1,
        employeeId: 'EMP001',
        type: 'Sick Leave',
        startDate: '2024-01-10',
        endDate: '2024-01-12',
        reason: 'Flu',
        status: 'Approved',
    },
    {
        id: 2,
        employeeId: 'EMP002',
        type: 'Casual Leave',
        startDate: '2024-02-05',
        endDate: '2024-02-06',
        reason: 'Personal',
        status: 'Pending',
    }
];

export const mockRoles = [
    { id: 1, name: 'ADMIN', description: 'Administrator', permissions: ['all'] },
    { id: 2, name: 'HR_ADMIN', description: 'HR Administrator', permissions: ['hr_read', 'hr_write'] },
    { id: 3, name: 'MANAGER', description: 'Manager', permissions: ['team_read', 'team_write'] },
    { id: 4, name: 'EMPLOYEE', description: 'Employee', permissions: ['self_read'] },
];

export const mockAttendance = [
    {
        id: 1,
        employeeId: 'EMP001',
        date: '2024-12-24',
        clockIn: '09:00 AM',
        clockOut: '06:00 PM',
        status: 'Present',
        workHours: '9.0',
    },
    {
        id: 2,
        employeeId: 'EMP001',
        date: '2024-12-25',
        clockIn: '09:15 AM',
        clockOut: '06:30 PM',
        status: 'Present',
        workHours: '9.25',
    },
    {
        id: 3,
        employeeId: 'EMP001',
        date: '2024-12-26',
        clockIn: '08:55 AM',
        clockOut: '05:45 PM',
        status: 'Present',
        workHours: '8.8',
    }
];

export const mockPayslips = [
    {
        id: 'PS001',
        employeeId: 'EMP001',
        month: 'December 2024',
        basicSalary: 5000,
        netSalary: 5500,
        status: 'Paid',
        date: '2024-12-31'
    },
    {
        id: 'PS002',
        employeeId: 'EMP001',
        month: 'November 2024',
        basicSalary: 5000,
        netSalary: 5500,
        status: 'Paid',
        date: '2024-11-30'
    },
    {
        id: 'PS003',
        employeeId: 'EMP001',
        month: 'October 2024',
        basicSalary: 5000,
        netSalary: 5500,
        status: 'Paid',
        date: '2024-10-31'
    }
];

export const mockAppraisals = [
    {
        id: 1,
        employeeId: 'EMP001',
        period: 'Q3 2024',
        score: 4.5,
        status: 'Completed',
        date: '2024-10-15',
        feedback: 'Excellent performance in project delivery.'
    },
    {
        id: 2,
        employeeId: 'EMP001',
        period: 'Q2 2024',
        score: 4.2,
        status: 'Completed',
        date: '2024-07-10',
        feedback: 'Good progress in technical skills.'
    }
];

export const mockHolidays = [
    { id: 1, name: "New Year's Day", date: "2025-01-01", type: "Public Holiday" },
    { id: 2, name: "Makar Sankranti", date: "2025-01-14", type: "Public Holiday" },
    { id: 3, name: "Republic Day", date: "2025-01-26", type: "Public Holiday" },
    { id: 4, name: "Holi", date: "2025-03-14", type: "Public Holiday" },
    { id: 5, name: "Good Friday", date: "2025-04-18", type: "Public Holiday" },
    { id: 6, name: "Eid-ul-Fitr", date: "2025-03-31", type: "Public Holiday" },
];

