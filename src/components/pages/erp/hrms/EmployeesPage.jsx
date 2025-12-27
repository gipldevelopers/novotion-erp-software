import { Plus, Download, MoreHorizontal, Eye, Edit } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const mockEmployees = [
    { id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering', position: 'Senior Developer', status: 'active', joinDate: '2022-03-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@company.com', department: 'Sales', position: 'Sales Manager', status: 'active', joinDate: '2021-08-01' },
    { id: '3', name: 'Mike Wilson', email: 'mike@company.com', department: 'HR', position: 'HR Manager', status: 'on_leave', joinDate: '2020-01-10' },
    { id: '4', name: 'Sarah Brown', email: 'sarah@company.com', department: 'Marketing', position: 'Marketing Lead', status: 'active', joinDate: '2023-02-20' },
    { id: '5', name: 'David Lee', email: 'david@company.com', department: 'Finance', position: 'Accountant', status: 'active', joinDate: '2022-11-05' },
];
const statusColors = { active: 'bg-success/10 text-success', on_leave: 'bg-warning/10 text-warning', terminated: 'bg-destructive/10 text-destructive' };
export const EmployeesPage = () => {
    const columns = [
        { key: 'name', header: 'Employee', render: (item) => (<div className="flex items-center gap-3">
        <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/10 text-primary text-sm">{item.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
        <div><p className="font-medium">{item.name}</p><p className="text-sm text-muted-foreground">{item.email}</p></div>
      </div>) },
        { key: 'department', header: 'Department' },
        { key: 'position', header: 'Position' },
        { key: 'status', header: 'Status', render: (item) => <Badge variant="secondary" className={statusColors[item.status]}>{item.status.replace('_', ' ')}</Badge> },
        { key: 'joinDate', header: 'Join Date' },
        { key: 'actions', header: '', className: 'w-12', render: () => (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end"><DropdownMenuItem><Eye className="h-4 w-4 mr-2"/>View</DropdownMenuItem><DropdownMenuItem><Edit className="h-4 w-4 mr-2"/>Edit</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>) },
    ];
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header"><h1 className="page-title">Employees</h1><p className="page-description">Manage employee directory</p></div>
        <div className="flex gap-3"><Button variant="outline"><Download className="h-4 w-4 mr-2"/>Export</Button><PermissionGuard permission="employees.create"><Button><Plus className="h-4 w-4 mr-2"/>Add Employee</Button></PermissionGuard></div>
      </div>
      <DataTable data={mockEmployees} columns={columns} searchable searchKeys={['name', 'email', 'department']}/>
    </div>);
};
