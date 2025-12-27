// Updated: 2025-12-27
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Download, Filter, MoreHorizontal, Eye, Edit, Trash2, Send } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
const mockInvoices = [
    { id: '1', number: 'INV-001', customer: 'Acme Corp', email: 'billing@acme.com', amount: 5200, status: 'paid', dueDate: '2024-01-15', createdAt: '2024-01-01' },
    { id: '2', number: 'INV-002', customer: 'TechStart Inc', email: 'finance@techstart.io', amount: 3400, status: 'pending', dueDate: '2024-01-25', createdAt: '2024-01-05' },
    { id: '3', number: 'INV-003', customer: 'Global Solutions', email: 'accounts@global.com', amount: 8900, status: 'overdue', dueDate: '2024-01-10', createdAt: '2024-01-02' },
    { id: '4', number: 'INV-004', customer: 'Smart Systems', email: 'billing@smart.io', amount: 2100, status: 'draft', dueDate: '2024-02-01', createdAt: '2024-01-20' },
    { id: '5', number: 'INV-005', customer: 'Alpha Industries', email: 'finance@alpha.com', amount: 15600, status: 'paid', dueDate: '2024-01-12', createdAt: '2024-01-03' },
    { id: '6', number: 'INV-006', customer: 'Beta Corp', email: 'accounts@beta.io', amount: 7800, status: 'pending', dueDate: '2024-01-28', createdAt: '2024-01-08' },
    { id: '7', number: 'INV-007', customer: 'Gamma LLC', email: 'billing@gamma.com', amount: 4500, status: 'paid', dueDate: '2024-01-18', createdAt: '2024-01-06' },
    { id: '8', number: 'INV-008', customer: 'Delta Systems', email: 'finance@delta.io', amount: 9200, status: 'overdue', dueDate: '2024-01-08', createdAt: '2024-01-01' },
];
const statusColors = {
    paid: 'bg-success/10 text-success border-success/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    overdue: 'bg-destructive/10 text-destructive border-destructive/20',
    draft: 'bg-muted text-muted-foreground border-border',
};
export const InvoicesPage = () => {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState('all');
    const filteredInvoices = statusFilter === 'all'
        ? mockInvoices
        : mockInvoices.filter((inv) => inv.status === statusFilter);
    const columns = [
        {
            key: 'number',
            header: 'Invoice #',
            render: (item) => (<span className="font-medium text-primary">{item.number}</span>),
        },
        {
            key: 'customer',
            header: 'Customer',
            render: (item) => (<div>
          <p className="font-medium">{item.customer}</p>
          <p className="text-sm text-muted-foreground">{item.email}</p>
        </div>),
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (item) => (<span className="font-semibold">${item.amount.toLocaleString()}</span>),
        },
        {
            key: 'status',
            header: 'Status',
            render: (item) => (<Badge variant="outline" className={statusColors[item.status]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>),
        },
        {
            key: 'dueDate',
            header: 'Due Date',
        },
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
            <DropdownMenuItem onClick={() => router.push(`/erp/accounting/invoices/${item.id}`)}>
              <Eye className="h-4 w-4 mr-2"/>
              View
            </DropdownMenuItem>
            <PermissionGuard permission="invoices.edit">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2"/>
                Edit
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="invoices.create">
              <DropdownMenuItem>
                <Send className="h-4 w-4 mr-2"/>
                Send
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="invoices.delete">
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
          <h1 className="page-title">Invoices</h1>
          <p className="page-description">Manage and track all your invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2"/>
            Export
          </Button>
          <PermissionGuard permission="invoices.create">
            <Button onClick={() => router.push('/erp/accounting/invoices/create')}>
              <Plus className="h-4 w-4 mr-2"/>
              New Invoice
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground"/>
          <span className="text-sm text-muted-foreground">Status:</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredInvoices} columns={columns} searchable searchKeys={['number', 'customer', 'email']} onRowClick={(item) => router.push(`/erp/accounting/invoices/${item.id}`)}/>
    </div>);
};
