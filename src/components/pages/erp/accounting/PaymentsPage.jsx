// Updated: 2025-12-27
import { useEffect, useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { accountingService } from '@/services/accountingService';

const methodLabels = {
  bank_transfer: 'Bank Transfer',
  credit_card: 'Credit Card',
  cash: 'Cash',
  check: 'Check',
  upi: 'UPI',
};

const statusColors = {
  completed: 'bg-success/10 text-success border-success/20',
  paid: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const PaymentsPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const invoices = await accountingService.getInvoices();
      // Filter only paid/completed invoices to show as payments
      const paymentItems = invoices.filter(inv => inv.status === 'paid' || inv.status === 'completed').map(inv => ({
        id: inv.id,
        invoiceNumber: inv.number,
        customer: inv.customer,
        amount: inv.amount,
        method: inv.paymentMethod || 'bank_transfer',
        status: inv.status,
        date: inv.createdAt.split('T')[0]
      }));
      setPayments(paymentItems);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const filteredPayments = statusFilter === 'all'
    ? payments
    : payments.filter((p) => p.status === statusFilter);

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
      render: (item) => methodLabels[item.method] || item.method,
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
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>

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
          <SelectItem value="paid">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <DataTable data={filteredPayments} columns={columns} searchable searchKeys={['invoiceNumber', 'customer']} />
  </div>);
};
