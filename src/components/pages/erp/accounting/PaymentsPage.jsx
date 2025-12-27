import { Download, Filter } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { useState } from 'react';
const mockPayments = [
    { id: '1', invoiceNumber: 'INV-001', customer: 'Acme Corp', amount: 6380, method: 'bank_transfer', status: 'completed', date: '2024-01-14' },
    { id: '2', invoiceNumber: 'INV-005', customer: 'Alpha Industries', amount: 15600, method: 'credit_card', status: 'completed', date: '2024-01-12' },
    { id: '3', invoiceNumber: 'INV-007', customer: 'Gamma LLC', amount: 4500, method: 'bank_transfer', status: 'completed', date: '2024-01-18' },
    { id: '4', invoiceNumber: 'INV-002', customer: 'TechStart Inc', amount: 3400, method: 'credit_card', status: 'pending', date: '2024-01-20' },
    { id: '5', invoiceNumber: 'INV-010', customer: 'Delta Corp', amount: 8200, method: 'check', status: 'failed', date: '2024-01-19' },
    { id: '6', invoiceNumber: 'INV-011', customer: 'Omega Inc', amount: 5600, method: 'cash', status: 'completed', date: '2024-01-21' },
];
const methodLabels = {
    bank_transfer: 'Bank Transfer',
    credit_card: 'Credit Card',
    cash: 'Cash',
    check: 'Check',
};
const statusColors = {
    completed: 'bg-success/10 text-success border-success/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    failed: 'bg-destructive/10 text-destructive border-destructive/20',
};
export const PaymentsPage = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const filteredPayments = statusFilter === 'all'
        ? mockPayments
        : mockPayments.filter((p) => p.status === statusFilter);
    const columns = [
        {
            key: 'invoiceNumber',
            header: 'Invoice',
            render: (item) => (<span className="font-medium text-primary">{item.invoiceNumber}</span>),
        },
        { key: 'customer', header: 'Customer' },
        {
            key: 'amount',
            header: 'Amount',
            render: (item) => (<span className="font-semibold">${item.amount.toLocaleString()}</span>),
        },
        {
            key: 'method',
            header: 'Method',
            render: (item) => methodLabels[item.method],
        },
        {
            key: 'status',
            header: 'Status',
            render: (item) => (<Badge variant="outline" className={statusColors[item.status]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>),
        },
        { key: 'date', header: 'Date' },
    ];
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Payments</h1>
          <p className="page-description">Track all payment transactions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2"/>
          Export
        </Button>
      </div>

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
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredPayments} columns={columns} searchable searchKeys={['invoiceNumber', 'customer']}/>
    </div>);
};
