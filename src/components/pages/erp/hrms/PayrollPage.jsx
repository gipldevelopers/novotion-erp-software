import { Download, Eye } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
const mockPayroll = [
    { id: '1', employee: 'John Doe', department: 'Engineering', baseSalary: 8000, deductions: 1200, netPay: 6800, status: 'paid', period: 'Jan 2024' },
    { id: '2', employee: 'Jane Smith', department: 'Sales', baseSalary: 7500, deductions: 1100, netPay: 6400, status: 'paid', period: 'Jan 2024' },
    { id: '3', employee: 'Mike Wilson', department: 'HR', baseSalary: 7000, deductions: 1050, netPay: 5950, status: 'pending', period: 'Jan 2024' },
    { id: '4', employee: 'Sarah Brown', department: 'Marketing', baseSalary: 6500, deductions: 975, netPay: 5525, status: 'processing', period: 'Jan 2024' },
];
const statusColors = { paid: 'bg-success/10 text-success', pending: 'bg-warning/10 text-warning', processing: 'bg-info/10 text-info' };
export const PayrollPage = () => {
    const columns = [
        { key: 'employee', header: 'Employee' },
        { key: 'department', header: 'Department' },
        { key: 'baseSalary', header: 'Base Salary', render: (item) => `$${item.baseSalary.toLocaleString()}` },
        { key: 'deductions', header: 'Deductions', render: (item) => <span className="text-destructive">-${item.deductions.toLocaleString()}</span> },
        { key: 'netPay', header: 'Net Pay', render: (item) => <span className="font-bold">${item.netPay.toLocaleString()}</span> },
        { key: 'status', header: 'Status', render: (item) => <Badge variant="secondary" className={statusColors[item.status]}>{item.status}</Badge> },
        { key: 'period', header: 'Period' },
        { key: 'actions', header: '', render: () => <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1"/>Payslip</Button> },
    ];
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header"><h1 className="page-title">Payroll</h1><p className="page-description">Manage employee payroll</p></div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2"/>Export</Button>
      </div>
      <DataTable data={mockPayroll} columns={columns} searchable searchKeys={['employee', 'department']}/>
    </div>);
};
