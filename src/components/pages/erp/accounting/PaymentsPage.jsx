import { useEffect, useState } from 'react';
import {
  Download,
  Filter,
  CreditCard,
  Banknote,
  Wallet,
  ArrowUpRight,
  Search,
  MoreVertical,
  Receipt,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Smartphone
} from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { accountingService } from '@/services/accountingService';
import { Skeleton } from '@/components/ui/skeleton';

const methodIcons = {
  bank_transfer: <Banknote className="h-4 w-4 text-blue-500" />,
  credit_card: <CreditCard className="h-4 w-4 text-purple-500" />,
  cash: <Wallet className="h-4 w-4 text-green-500" />,
  upi: <Smartphone className="h-4 w-4 text-orange-500" />,
};

const methodLabels = {
  bank_transfer: 'Bank Transfer',
  credit_card: 'Credit Card',
  cash: 'Cash',
  check: 'Check',
  upi: 'UPI',
};

const statusConfig = {
  completed: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
  paid: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
  pending: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: <Clock className="h-3 w-3 mr-1" /> },
  failed: { color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: <XCircle className="h-3 w-3 mr-1" /> },
};

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

const PaymentDetailsDialog = ({ payment, open, onOpenChange }) => {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background">
        <DialogHeader>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className={`font-bold text-[10px] px-2 py-0.5 ${statusConfig[payment.status]?.color}`}>
              {statusConfig[payment.status]?.icon}
              {payment.status.toUpperCase()}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">{payment.id}</span>
          </div>
          <DialogTitle className="text-2xl font-black mt-2">
            ₹{payment.amount.toLocaleString('en-IN')}
          </DialogTitle>
          <DialogDescription>
            Payment for {payment.invoiceNumber} • {payment.date}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-6 border-y my-4">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Customer</p>
              <p className="text-sm font-bold mt-0.5">{payment.customer}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reference ID</p>
              <p className="text-sm font-mono mt-0.5">{payment.reference}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Payment Method</p>
              <div className="flex items-center gap-2 mt-0.5">
                {methodIcons[payment.method]}
                <p className="text-sm font-bold">{methodLabels[payment.method]}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gateway</p>
              <div className="flex items-center gap-2 mt-0.5">
                <ShieldCheck className="h-3 w-3 text-blue-500" />
                <p className="text-sm font-bold">{payment.gateway}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h4 className="font-bold text-sm">Transaction Breakdown</h4>
          <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{payment.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gateway Fees</span>
              <span className="text-red-500 font-medium">- ₹{payment.fees || 0}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
              <span>Net Settled</span>
              <span className="text-green-600">₹{(payment.amount - (payment.fees || 0)).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="default" className="flex-1 bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button variant="outline" className="flex-1">
            <Receipt className="h-4 w-4 mr-2" />
            View Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PaymentsPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const data = await accountingService.getPayments();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleRowClick = (payment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  const filteredPayments = payments.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch = p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalCollected: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    failedCount: payments.filter(p => p.status === 'failed').length,
    successRate: payments.length > 0 ? ((payments.filter(p => p.status === 'completed').length / payments.length) * 100).toFixed(1) : 0
  };

  const columns = [
    {
      key: 'id',
      header: 'Transaction ID',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-muted-foreground uppercase">{item.id}</span>
          <span className="text-[10px] text-muted-foreground">{item.date}</span>
        </div>
      ),
    },
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      render: (item) => (
        <div className="flex items-center gap-1.5 font-bold text-primary hover:underline cursor-pointer">
          <Receipt className="h-3 w-3" />
          {item.invoiceNumber}
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (item) => (
        <div className="font-medium whitespace-nowrap">{item.customer}</div>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => (
        <div className="flex flex-col items-end">
          <span className="font-bold text-sm">₹{item.amount.toLocaleString('en-IN')}</span>
          {item.fees > 0 && <span className="text-[10px] text-red-500">Fees: ₹{item.fees}</span>}
        </div>
      ),
    },
    {
      key: 'method',
      header: 'Payment Method',
      render: (item) => (
        <div className="flex items-center gap-2">
          {methodIcons[item.method]}
          <span className="text-xs font-medium">{methodLabels[item.method] || item.method}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge variant="outline" className={`font-bold text-[10px] px-2 py-0.5 ${statusConfig[item.status]?.color}`}>
          {statusConfig[item.status]?.icon}
          {item.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              View Transaction
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </DropdownMenuItem>
            {item.status === 'completed' && (
              <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                <XCircle className="h-4 w-4 mr-2" />
                Refund Payment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in bg-background/50 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">
            Consolidated view of all inbound and outbound transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-background">
            <Download className="h-4 w-4 mr-2 text-muted-foreground" />
            Export Data
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-slate-200">
            <CreditCard className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-card overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ShieldCheck className="h-12 w-12 text-green-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-primary">₹{stats.totalCollected.toLocaleString('en-IN')}</div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Clock className="h-12 w-12 text-yellow-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">In Clearing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-yellow-600">₹{stats.pending.toLocaleString('en-IN')}</div>
            <p className="text-[10px] text-muted-foreground mt-1">3 transactions pending</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-600">{stats.failedCount}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Requires manual review</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm text-primary overflow-hidden relative bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider uppercase">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{stats.successRate}%</div>
            <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${stats.successRate}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card className="border-none shadow-sm bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Invoice, Customer or Reference..."
                className="pl-10 h-11 border-input focus:ring-primary rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Filter By:</span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44 h-11 border-input rounded-lg">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Every Payment</SelectItem>
                  <SelectItem value="completed">Completed Only</SelectItem>
                  <SelectItem value="pending">Awaiting Sync</SelectItem>
                  <SelectItem value="failed">Failed Logs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
        <DataTable
          data={filteredPayments}
          columns={columns}
          searchable={false}
          className="border-none"
          onRowClick={handleRowClick}
        />

        {filteredPayments.length === 0 && (
          <div className="py-20 text-center">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No transactions found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto text-sm mt-1">We couldn't find any payments matching your current search or filter criteria.</p>
            <Button variant="link" className="mt-2 text-primary" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>Clear all filters</Button>
          </div>
        )}
      </div>

      <PaymentDetailsDialog
        payment={selectedPayment}
        open={showDetails}
        onOpenChange={(open) => {
          setShowDetails(open);
          if (!open) {
            // Reset pointer events to fix potential locking issues
            document.body.style.pointerEvents = 'auto';
          }
        }}
      />
    </div>
  );
};
