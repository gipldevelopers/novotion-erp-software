// Updated: 2025-12-27
import { Plus, Download, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
const mockCustomers = [
    { id: '1', name: 'John Smith', email: 'john@acme.com', phone: '+1 555-0101', company: 'Acme Corp', status: 'active', totalSpent: 45000, lastOrder: '2024-01-15' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@techstart.io', phone: '+1 555-0102', company: 'TechStart Inc', status: 'active', totalSpent: 32000, lastOrder: '2024-01-12' },
    { id: '3', name: 'Mike Wilson', email: 'mike@global.com', phone: '+1 555-0103', company: 'Global Solutions', status: 'inactive', totalSpent: 18000, lastOrder: '2023-11-20' },
    { id: '4', name: 'Emily Brown', email: 'emily@alpha.com', phone: '+1 555-0104', company: 'Alpha Industries', status: 'active', totalSpent: 67000, lastOrder: '2024-01-18' },
    { id: '5', name: 'David Lee', email: 'david@beta.io', phone: '+1 555-0105', company: 'Beta Corp', status: 'prospect', totalSpent: 0, lastOrder: '-' },
    { id: '6', name: 'Lisa Chen', email: 'lisa@gamma.com', phone: '+1 555-0106', company: 'Gamma LLC', status: 'active', totalSpent: 28000, lastOrder: '2024-01-10' },
];
const statusColors = {
    active: 'bg-success/10 text-success border-success/20',
    inactive: 'bg-muted text-muted-foreground border-border',
    prospect: 'bg-info/10 text-info border-info/20',
};
export const CustomersPage = () => {
    const columns = [
        {
            key: 'name',
            header: 'Customer',
            render: (item) => (<div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {item.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.company}</p>
          </div>
        </div>),
        },
        {
            key: 'contact',
            header: 'Contact',
            render: (item) => (<div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3"/>
            {item.email}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-3 w-3"/>
            {item.phone}
          </div>
        </div>),
        },
        {
            key: 'status',
            header: 'Status',
            render: (item) => (<Badge variant="outline" className={statusColors[item.status]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>),
        },
        {
            key: 'totalSpent',
            header: 'Total Spent',
            render: (item) => (<span className="font-semibold">${item.totalSpent.toLocaleString()}</span>),
        },
        { key: 'lastOrder', header: 'Last Order' },
        {
            key: 'actions',
            header: '',
            className: 'w-12',
            render: (item) => (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2"/>
              View Profile
            </DropdownMenuItem>
            <PermissionGuard permission="customers.edit">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2"/>
                Edit
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="customers.delete">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2"/>
                Delete
              </DropdownMenuItem>
            </PermissionGuard>
          </DropdownMenuContent>
        </DropdownMenu>),
        },
    ];
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Customers</h1>
          <p className="page-description">Manage your customer relationships</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2"/>
            Export
          </Button>
          <PermissionGuard permission="customers.create">
            <Button>
              <Plus className="h-4 w-4 mr-2"/>
              Add Customer
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <DataTable data={mockCustomers} columns={columns} searchable searchKeys={['name', 'email', 'company']}/>
    </div>);
};
