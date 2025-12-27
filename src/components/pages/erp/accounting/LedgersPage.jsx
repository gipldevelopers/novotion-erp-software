import { Download, Plus } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
const mockLedger = [
    { id: '1', date: '2024-01-01', description: 'Opening Balance', account: 'Cash', debit: 50000, credit: 0, balance: 50000 },
    { id: '2', date: '2024-01-03', description: 'Sales Revenue - INV-001', account: 'Accounts Receivable', debit: 6380, credit: 0, balance: 56380 },
    { id: '3', date: '2024-01-05', description: 'Office Rent Payment', account: 'Rent Expense', debit: 0, credit: 3500, balance: 52880 },
    { id: '4', date: '2024-01-08', description: 'Payment Received - INV-001', account: 'Cash', debit: 6380, credit: 0, balance: 59260 },
    { id: '5', date: '2024-01-10', description: 'Utility Bills', account: 'Utilities Expense', debit: 0, credit: 850, balance: 58410 },
    { id: '6', date: '2024-01-12', description: 'Sales Revenue - INV-005', account: 'Accounts Receivable', debit: 15600, credit: 0, balance: 74010 },
    { id: '7', date: '2024-01-14', description: 'Payroll', account: 'Salary Expense', debit: 0, credit: 12000, balance: 62010 },
    { id: '8', date: '2024-01-15', description: 'Equipment Purchase', account: 'Equipment', debit: 0, credit: 5000, balance: 57010 },
];
export const LedgersPage = () => {
    const columns = [
        { key: 'date', header: 'Date' },
        { key: 'description', header: 'Description' },
        {
            key: 'account',
            header: 'Account',
            render: (item) => (<Badge variant="outline">{item.account}</Badge>),
        },
        {
            key: 'debit',
            header: 'Debit',
            className: 'text-right',
            render: (item) => (<span className={item.debit > 0 ? 'text-success font-medium' : 'text-muted-foreground'}>
          {item.debit > 0 ? `$${item.debit.toLocaleString()}` : '-'}
        </span>),
        },
        {
            key: 'credit',
            header: 'Credit',
            className: 'text-right',
            render: (item) => (<span className={item.credit > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
          {item.credit > 0 ? `$${item.credit.toLocaleString()}` : '-'}
        </span>),
        },
        {
            key: 'balance',
            header: 'Balance',
            className: 'text-right',
            render: (item) => (<span className="font-bold">${item.balance.toLocaleString()}</span>),
        },
    ];
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">General Ledger</h1>
          <p className="page-description">View all financial transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2"/>
            Export
          </Button>
          <PermissionGuard permission="ledgers.create">
            <Button>
              <Plus className="h-4 w-4 mr-2"/>
              Add Entry
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <DataTable data={mockLedger} columns={columns} searchable searchKeys={['description', 'account']}/>
    </div>);
};
