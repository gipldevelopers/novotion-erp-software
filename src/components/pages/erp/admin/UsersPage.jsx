import { DataTable } from '@/components/erp/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@erp.com', role: 'Admin', status: 'active', lastLogin: '2024-01-20 10:30' },
    { id: '2', name: 'John Manager', email: 'manager@erp.com', role: 'Manager', status: 'active', lastLogin: '2024-01-20 09:15' },
    { id: '3', name: 'Jane Accountant', email: 'accountant@erp.com', role: 'Accountant', status: 'active', lastLogin: '2024-01-19 16:45' },
    { id: '4', name: 'Mike Sales', email: 'sales@erp.com', role: 'Sales', status: 'inactive', lastLogin: '2024-01-15 14:20' },
];
export const UsersPage = () => {
    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role', render: (item) => <Badge variant="outline">{item.role}</Badge> },
        { key: 'status', header: 'Status', render: (item) => <Badge variant="secondary" className={item.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted'}>{item.status}</Badge> },
        { key: 'lastLogin', header: 'Last Login' },
        { key: 'actions', header: '', render: () => (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
        <DropdownMenuContent><DropdownMenuItem><Edit className="h-4 w-4 mr-2"/>Edit</DropdownMenuItem><DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2"/>Delete</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>) }
    ];
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex justify-between"><div className="page-header"><h1 className="page-title">Users</h1><p className="page-description">Manage system users</p></div><PermissionGuard permission="users.create"><Button><Plus className="h-4 w-4 mr-2"/>Add User</Button></PermissionGuard></div>
      <DataTable data={mockUsers} columns={columns} searchable searchKeys={['name', 'email', 'role']}/>
    </div>);
};
