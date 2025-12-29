// Updated: 2025-12-27
import { useEffect, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { accountingService } from '@/services/accountingService';

export const LedgersPage = () => {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedgers = async () => {
      const data = await accountingService.getLedgers();
      setLedgers(data);
      setLoading(false);
    };
    fetchLedgers();
  }, []);

  const columns = [
    { key: 'account', header: 'Account' },
    {
      key: 'category',
      header: 'Category',
      render: (item) => (<Badge variant="outline">{item.category}</Badge>),
    },
    {
      key: 'balance',
      header: 'Balance',
      className: 'text-right',
      render: (item) => (<span className="font-bold">${item.balance.toLocaleString()}</span>),
    },
  ];

  // Note: The mock ledger in the original file was more detailed (debit/credit). 
  // I'm simplifying to show the accounts from the new service.

  return (<div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <div className="page-header">
        <h1 className="page-title">General Ledger</h1>
        <p className="page-description">View all financial accounts and balances</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <PermissionGuard permission="ledgers.create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </PermissionGuard>
      </div>
    </div>

    <DataTable data={ledgers} columns={columns} searchable searchKeys={['account', 'category']} />
  </div>);
};
