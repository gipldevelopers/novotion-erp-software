// Updated: 2025-12-27
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Download, Filter, MoreHorizontal, Eye, Edit, Trash2, Send } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { accountingService } from '@/services/accountingService';

const statusColors = {
  paid: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
  draft: 'bg-muted text-muted-foreground border-border',
};

export const InvoicesPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('all');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      const data = await accountingService.getInvoices();
      setInvoices(data);
      setLoading(false);
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = statusFilter === 'all'
    ? invoices
    : invoices.filter((inv) => inv.status === statusFilter);
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
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/erp/accounting/invoices/${item.id}`)}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </DropdownMenuItem>
          <PermissionGuard permission="invoices.edit">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </PermissionGuard>
          <PermissionGuard permission="invoices.create">
            <DropdownMenuItem>
              <Send className="h-4 w-4 mr-2" />
              Send
            </DropdownMenuItem>
          </PermissionGuard>
          <PermissionGuard permission="invoices.delete">
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
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
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <PermissionGuard permission="invoices.create">
          <Button onClick={() => router.push('/erp/accounting/invoices/create')}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </PermissionGuard>
      </div>
    </div>

    {/* Filters */}
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
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

    <DataTable data={filteredInvoices} columns={columns} searchable searchKeys={['number', 'customer', 'email']} onRowClick={(item) => router.push(`/erp/accounting/invoices/${item.id}`)} />
  </div>);
};
