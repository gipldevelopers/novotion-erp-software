import { DataTable } from '@/components/erp/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit } from 'lucide-react';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
const mockRoles = [
    { id: '1', name: 'Admin', description: 'Full system access', usersCount: 2, permissions: 45 },
    { id: '2', name: 'Manager', description: 'Manage operations', usersCount: 5, permissions: 32 },
    { id: '3', name: 'Accountant', description: 'Accounting access', usersCount: 3, permissions: 18 },
    { id: '4', name: 'Sales', description: 'CRM and sales', usersCount: 8, permissions: 15 },
    { id: '5', name: 'Cashier', description: 'POS access only', usersCount: 4, permissions: 8 },
];
export const RolesPage = () => {
    const columns = [
        { key: 'name', header: 'Role', render: (item) => <span className="font-medium">{item.name}</span> },
        { key: 'description', header: 'Description' },
        { key: 'usersCount', header: 'Users', render: (item) => <Badge variant="secondary">{item.usersCount}</Badge> },
        { key: 'permissions', header: 'Permissions', render: (item) => <span>{item.permissions} permissions</span> },
        { key: 'actions', header: '', render: () => <Button variant="ghost" size="sm"><Edit className="h-4 w-4 mr-1"/>Edit</Button> }
    ];
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex justify-between"><div className="page-header"><h1 className="page-title">Roles</h1><p className="page-description">Manage user roles</p></div><PermissionGuard permission="roles.create"><Button><Plus className="h-4 w-4 mr-2"/>Add Role</Button></PermissionGuard></div>
      <DataTable data={mockRoles} columns={columns} searchable searchKeys={['name', 'description']}/>
    </div>);
};
