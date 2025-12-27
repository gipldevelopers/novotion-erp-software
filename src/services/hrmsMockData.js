export const employees = [
    {
        id: 'EMP-001',
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@company.com',
        phone: '+1 (555) 123-4567',
        department: 'Engineering',
        designation: 'Senior Frontend Engineer',
        status: 'Active',
        joinDate: '2022-03-15',
        salary: 120000,
        avatar: '/avatars/01.png',
        manager: 'EMP-005',
        address: '123 Tech Blvd, San Francisco, CA'
    },
    {
        id: 'EMP-002',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@company.com',
        phone: '+1 (555) 987-6543',
        department: 'Product',
        designation: 'Product Manager',
        status: 'Active',
        joinDate: '2023-01-10',
        salary: 135000,
        avatar: '/avatars/02.png',
        manager: 'EMP-005',
        address: '456 Innovation Way, San Jose, CA'
    },
    {
        id: 'EMP-003',
        firstName: 'Jessica',
        lastName: 'Davis',
        email: 'jessica.davis@company.com',
        phone: '+1 (555) 456-7890',
        department: 'HR',
        designation: 'HR Specialist',
        status: 'Active',
        joinDate: '2021-11-05',
        salary: 85000,
        avatar: '/avatars/03.png',
        manager: 'EMP-004',
        address: '789 People Ln, Austin, TX'
    },
    {
        id: 'EMP-004',
        firstName: 'David',
        lastName: 'Rodriguez',
        email: 'david.rodriguez@company.com',
        phone: '+1 (555) 222-3333',
        department: 'HR',
        designation: 'HR Director',
        status: 'Active',
        joinDate: '2020-06-20',
        salary: 150000,
        avatar: '/avatars/04.png',
        manager: 'EMP-001', // Self-managed or CEO
        address: '101 Leadership Dr, New York, NY'
    },
    {
        id: 'EMP-005',
        firstName: 'Emily',
        lastName: 'Watson',
        email: 'emily.watson@company.com',
        phone: '+1 (555) 777-8888',
        department: 'Engineering',
        designation: 'CTO',
        status: 'Active',
        joinDate: '2019-02-01',
        salary: 220000,
        avatar: '/avatars/05.png',
        manager: '',
        address: '202 Executive Rd, Seattle, WA'
    }
];

export const attendance = [
    { id: 'ATT-001', employeeId: 'EMP-001', date: '2024-12-26', checkIn: '09:00', checkOut: '17:30', status: 'Present', hours: 8.5 },
    { id: 'ATT-002', employeeId: 'EMP-001', date: '2024-12-25', checkIn: '09:15', checkOut: '17:15', status: 'Present', hours: 8.0 },
    { id: 'ATT-003', employeeId: 'EMP-002', date: '2024-12-26', checkIn: '08:45', checkOut: '18:00', status: 'Present', hours: 9.25 },
    { id: 'ATT-004', employeeId: 'EMP-003', date: '2024-12-26', checkIn: '', checkOut: '', status: 'Absent', hours: 0 },
    { id: 'ATT-005', employeeId: 'EMP-004', date: '2024-12-26', checkIn: '10:00', checkOut: '16:00', status: 'Half Day', hours: 6.0 },
];

export const leaves = [
    { id: 'LEAVE-001', employeeId: 'EMP-001', type: 'Sick Leave', startDate: '2024-11-10', endDate: '2024-11-12', status: 'Approved', reason: 'Flu' },
    { id: 'LEAVE-002', employeeId: 'EMP-002', type: 'Casual Leave', startDate: '2024-12-30', endDate: '2024-12-31', status: 'Pending', reason: 'Family vacation' },
    { id: 'LEAVE-003', employeeId: 'EMP-003', type: 'Sick Leave', startDate: '2024-12-26', endDate: '2024-12-26', status: 'Approved', reason: 'Migraine' },
];

export const payroll = [
    { id: 'PAY-001', employeeId: 'EMP-001', month: 'November 2024', basic: 8000, allowances: 2000, deductions: 1500, netSalary: 8500, status: 'Paid', date: '2024-11-30' },
    { id: 'PAY-002', employeeId: 'EMP-002', month: 'November 2024', basic: 9000, allowances: 2250, deductions: 1800, netSalary: 9450, status: 'Paid', date: '2024-11-30' },
    { id: 'PAY-003', employeeId: 'EMP-003', month: 'November 2024', basic: 5666, allowances: 1416, deductions: 800, netSalary: 6282, status: 'Paid', date: '2024-11-30' },
];

export const performance = [
    { id: 'PERF-001', employeeId: 'EMP-001', reviewPeriod: '2024 Q3', rating: 4.5, reviewer: 'EMP-005', comments: 'Excellent delivery on the new dashboard project.', date: '2024-10-15' },
    { id: 'PERF-002', employeeId: 'EMP-002', reviewPeriod: '2024 Q3', rating: 4.2, reviewer: 'EMP-005', comments: 'Good product insights, needs to improve documentation.', date: '2024-10-14' },
];

export const documents = [
    { id: 'DOC-001', employeeId: 'EMP-001', name: 'Employment Contract.pdf', type: 'Contract', uploadDate: '2022-03-15' },
    { id: 'DOC-002', employeeId: 'EMP-001', name: 'ID Proof.jpg', type: 'ID', uploadDate: '2022-03-15' },
];

export const hrmsMetrics = {
    totalEmployees: 145,
    activeEmployees: 142,
    onLeaveToday: 3,
    newHiresThisMonth: 5,
    departmentHeadcount: [
        { name: 'Engineering', value: 60 },
        { name: 'Product', value: 20 },
        { name: 'Sales', value: 35 },
        { name: 'HR', value: 10 },
        { name: 'Marketing', value: 15 },
        { name: 'Finance', value: 5 },
    ],
    attendanceTrend: [
        { day: 'Mon', present: 138, absent: 4, leave: 3 },
        { day: 'Tue', present: 140, absent: 2, leave: 3 },
        { day: 'Wed', present: 135, absent: 5, leave: 5 },
        { day: 'Thu', present: 139, absent: 3, leave: 3 }, // Today
        { day: 'Fri', present: 0, absent: 0, leave: 0 },
    ]
};
