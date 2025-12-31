// Updated: 2025-12-27
import { useEffect, useState, useMemo } from 'react';
import {
  Download,
  Plus,
  Filter,
  RefreshCw,
  Eye,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Search,
  Calendar,
  ChevronDown,
  FileText,
  Activity,
  PlusCircle,
  MinusCircle,
  Check,
  X
} from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { accountingService } from '@/services/accountingService';
import { Skeleton } from '@/components/ui/skeleton';

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Ledger Entry Form Component
const LedgerEntryForm = ({ accounts, onSuccess, onCancel }) => {
  const [entries, setEntries] = useState([
    { account: '', debit: 0, credit: 0, description: '' },
    { account: '', debit: 0, credit: 0, description: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');

  const addEntry = () => {
    setEntries([...entries, { account: '', debit: 0, credit: 0, description: '' }]);
  };

  const removeEntry = (index) => {
    if (entries.length > 2) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const totalDebits = entries.reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);
  const totalCredits = entries.reduce((sum, entry) => sum + parseFloat(entry.credit || 0), 0);
  const isBalanced = totalDebits > 0 && totalDebits === totalCredits;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isBalanced) return;

    setLoading(true);
    try {
      await accountingService.postJournalEntry({
        date,
        reference,
        entries
      });
      onSuccess();
    } catch (error) {
      console.error('Error posting entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Reference Number</Label>
          <Input
            placeholder="e.g. JE-001"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Journal Entries</h4>
          <Button type="button" variant="outline" size="sm" onClick={addEntry}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Line
          </Button>
        </div>

        {entries.map((entry, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg bg-card/50">
            <div className="col-span-4">
              <Label className="text-xs">Account</Label>
              <Select
                value={entry.account}
                onValueChange={(val) => updateEntry(index, 'account', val)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.account}>
                      {acc.account} ({acc.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Debit</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="h-9"
                value={entry.debit}
                onChange={(e) => updateEntry(index, 'debit', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Credit</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="h-9"
                value={entry.credit}
                onChange={(e) => updateEntry(index, 'credit', e.target.value)}
              />
            </div>
            <div className="col-span-3">
              <Label className="text-xs">Description</Label>
              <Input
                placeholder="Memo"
                className="h-9"
                value={entry.description}
                onChange={(e) => updateEntry(index, 'description', e.target.value)}
              />
            </div>
            <div className="col-span-1">
              {entries.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive"
                  onClick={() => removeEntry(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Debits</div>
          <div className="text-xl font-bold">{formatCurrency(totalDebits)}</div>
        </div>
        <div className="text-right space-y-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Credits</div>
          <div className="text-xl font-bold">{formatCurrency(totalCredits)}</div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${isBalanced ? 'bg-green-100/50 text-green-700 border border-green-200' : 'bg-red-100/50 text-red-700 border border-red-200'}`}>
          {isBalanced ? (
            <>
              <Check className="h-4 w-4" />
              Balanced
            </>
          ) : (
            <>
              <X className="h-4 w-4" />
              {totalDebits === totalCredits ? 'Amount Required' : 'Not Balanced'}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!isBalanced || loading}>
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          Post Entry
        </Button>
      </div>
    </form>
  );
};

// Edit Account Form Component
const EditAccountForm = ({ ledger, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    account: ledger.account,
    code: ledger.code || '',
    category: ledger.category,
    description: ledger.description || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await accountingService.updateLedger(ledger.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Account Name</Label>
          <Input
            value={formData.account}
            onChange={(e) => setFormData({ ...formData, account: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Account Code</Label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g. 1001"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={formData.category}
          onValueChange={(val) => setFormData({ ...formData, category: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Assets">Assets</SelectItem>
            <SelectItem value="Liabilities">Liabilities</SelectItem>
            <SelectItem value="Equity">Equity</SelectItem>
            <SelectItem value="Revenue">Revenue</SelectItem>
            <SelectItem value="Expenses">Expenses</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed description of this account"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

// Ledger Detail View Component
const LedgerDetailView = ({ ledger, onClose, defaultTab = 'transactions' }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await accountingService.getLedgerTransactions(ledger.id);
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [ledger.id]);

  const transactionColumns = [
    { key: 'date', header: 'Date', render: (item) => formatDate(new Date(item.date)) },
    { key: 'description', header: 'Description' },
    {
      key: 'debit',
      header: 'Debit',
      className: 'text-right',
      render: (item) => item.debit > 0 ? formatCurrency(item.debit) : '-'
    },
    {
      key: 'credit',
      header: 'Credit',
      className: 'text-right',
      render: (item) => item.credit > 0 ? formatCurrency(item.credit) : '-'
    },
    {
      key: 'balance',
      header: 'Balance',
      className: 'text-right font-bold',
      render: (item) => formatCurrency(item.balance)
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{ledger.account}</h2>
            <Badge variant={ledger.status === 'inactive' ? 'destructive' : 'success'}>
              {ledger.status || 'Active'}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono">{ledger.code || 'ACC-001'}</Badge>
            <Badge variant="secondary">{ledger.category}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created: {ledger.createdAt ? formatDate(new Date(ledger.createdAt)) : 'N/A'}
            </span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(ledger.balance)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+12.5% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">YTD Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Debits</span>
                <span className="font-semibold text-green-600">$45,678.90</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Credits</span>
                <span className="font-semibold text-red-600">$32,456.78</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Statement
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Ledger
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-6">
          <TabsTrigger
            value="transactions"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
          >
            <Activity className="h-4 w-4 mr-2" />
            Recent Transactions
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance Analysis
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
          >
            <FileText className="h-4 w-4 mr-2" />
            Account Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4 pt-4 border-t-0">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : transactions.length > 0 ? (
            <DataTable
              data={transactions}
              columns={transactionColumns}
              pagination={false}
              searchable={false}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No recent transactions</p>
              <p className="text-sm">Start by posting a journal entry for this account.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="mt-4">
          <div className="p-8 text-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
            Detailed visualization coming soon.
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Basic Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">Account Name</span>
                      <span className="text-sm font-medium">{ledger.account}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">Account Code</span>
                      <span className="text-sm font-medium font-mono">{ledger.code || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">Category</span>
                      <span className="text-sm font-medium">{ledger.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">Status</span>
                      <Badge variant={ledger.status === 'inactive' ? 'destructive' : 'success'} className="h-5 text-[10px]">
                        {ledger.status || 'Active'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description & Notes</h4>
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border text-sm text-muted-foreground min-h-[120px]">
                    {ledger.description || "No additional description provided for this account."}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Last reconciled: Never
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ title, value, subtitle, trend, className = '' }) => (
  <Card className={className}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{formatCurrency(value)}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {trend && (
          <div className={`p-3 rounded-full ${trend > 0
            ? 'bg-green-100 text-green-600'
            : 'bg-red-100 text-red-600'
            }`}>
            {trend > 0 ? (
              <TrendingUp className="h-6 w-6" />
            ) : (
              <TrendingDown className="h-6 w-6" />
            )}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Main LedgersPage Component
export const LedgersPage = () => {
  const [ledgersData, setLedgersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [showEntryDialog, setShowEntryDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    netIncome: 0
  });

  useEffect(() => {
    fetchLedgers();
  }, []);

  useEffect(() => {
    calculateStatistics(ledgersData);
  }, [ledgersData]);

  const fetchLedgers = async () => {
    setLoading(true);
    try {
      const data = await accountingService.getLedgers();
      setLedgersData(data);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (data) => {
    if (!data.length) return;

    const stats = data.reduce((acc, ledger) => {
      const category = ledger.category;
      if (category === 'Assets') acc.totalAssets += ledger.balance;
      else if (category === 'Liabilities') acc.totalLiabilities += ledger.balance;
      else if (category === 'Equity') acc.totalEquity += ledger.balance;
      else if (category === 'Revenue' || category === 'Income') acc.netIncome += ledger.balance;
      else if (category === 'Expenses') acc.netIncome -= ledger.balance;
      return acc;
    }, { totalAssets: 0, totalLiabilities: 0, totalEquity: 0, netIncome: 0 });

    setStatistics(stats);
  };

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(ledgersData.map(l => l.category))];
    return ['all', ...uniqueCategories];
  }, [ledgersData]);

  const filteredLedgers = useMemo(() => {
    return ledgersData.filter(ledger => {
      const matchesSearch = searchQuery === '' ||
        ledger.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ledger.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ledger.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || ledger.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [ledgersData, searchQuery, categoryFilter]);

  const handleExport = (format = 'csv') => {
    // Export functionality
    const dataStr = JSON.stringify(filteredLedgers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `ledgers_${new Date().toISOString().split('T')[0]}.${format}`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    console.log(`Exported ${filteredLedgers.length} ledgers in ${format} format`);
  };

  const columns = [
    {
      key: 'code',
      header: 'Code',
      width: '100px'
    },
    {
      key: 'account',
      header: 'Account',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.account}</span>
          {item.description && (
            <span className="text-sm text-muted-foreground truncate max-w-xs">
              {item.description}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => (
        <Badge
          variant="outline"
          className={`
            ${item.category === 'Assets' ? 'border-green-200 bg-green-50 text-green-700' : ''}
            ${item.category === 'Liabilities' ? 'border-red-200 bg-red-50 text-red-700' : ''}
            ${item.category === 'Equity' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
            ${item.category === 'Revenue' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''}
            ${item.category === 'Expenses' ? 'border-amber-200 bg-amber-50 text-amber-700' : ''}
          `}
        >
          {item.category}
        </Badge>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <Badge variant="secondary">
          {item.type || 'General'}
        </Badge>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      className: 'text-right font-mono',
      render: (item) => (
        <div className="flex flex-col items-end">
          <span className={`font-bold ${(item.category === 'Assets' || item.category === 'Revenue')
            ? 'text-green-600'
            : item.category === 'Liabilities' || item.category === 'Expenses'
              ? 'text-red-600'
              : 'text-blue-600'
            }`}>
            {formatCurrency(item.balance)}
          </span>
          <span className="text-xs text-muted-foreground">
            {item.currency || 'USD'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              // Wrap in setTimeout to ensure DropdownMenu closes before opening Dialog
              setTimeout(() => {
                setSelectedLedger(item);
                setActiveTab('details');
                setShowDetailDialog(true);
              }, 0);
            }}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setTimeout(() => {
                setSelectedLedger(item);
                setActiveTab('transactions');
                setShowDetailDialog(true);
              }, 0);
            }}>
              <TrendingUp className="h-4 w-4 mr-2" />
              View Transactions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setTimeout(() => {
                setSelectedLedger(item);
                setShowEditDialog(true);
              }, 0);
            }}>
              <Check className="h-4 w-4 mr-2" />
              Edit Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                setTimeout(async () => {
                  if (confirm(`Are you sure you want to ${item.status === 'inactive' ? 'activate' : 'deactivate'} this account?`)) {
                    await accountingService.updateLedger(item.id, {
                      status: item.status === 'inactive' ? 'active' : 'inactive'
                    });
                    fetchLedgers();
                  }
                }, 0);
              }}
            >
              {item.status === 'inactive' ? 'Activate' : 'Deactivate'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">General Ledger</h1>
          <p className="page-description">
            View and manage all financial accounts, balances, and transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchLedgers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <PermissionGuard permission="ledgers.create">
            <Dialog open={showEntryDialog} onOpenChange={(open) => {
              setShowEntryDialog(open);
              if (!open) document.body.style.pointerEvents = 'auto';
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create New Journal Entry</DialogTitle>
                </DialogHeader>
                <LedgerEntryForm
                  accounts={ledgersData}
                  onSuccess={() => {
                    setShowEntryDialog(false);
                    fetchLedgers();
                  }}
                  onCancel={() => setShowEntryDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assets"
          value={statistics.totalAssets}
          subtitle="Current period"
          trend={10}
          className="border-l-4 border-l-green-500"
        />
        <StatCard
          title="Total Liabilities"
          value={statistics.totalLiabilities}
          subtitle="Current period"
          trend={-5}
          className="border-l-4 border-l-red-500"
        />
        <StatCard
          title="Total Equity"
          value={statistics.totalEquity}
          subtitle="Current period"
          trend={8}
          className="border-l-4 border-l-blue-500"
        />
        <StatCard
          title="Net Income"
          value={statistics.netIncome}
          subtitle="YTD"
          trend={statistics.netIncome > 0 ? 15 : -15}
          className="border-l-4 border-l-emerald-500"
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search accounts, codes, descriptions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Table with Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Accounts ({ledgersData.length})</TabsTrigger>
          <TabsTrigger value="assets">Assets ({ledgersData.filter(l => l.category === 'Assets').length})</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities ({ledgersData.filter(l => l.category === 'Liabilities').length})</TabsTrigger>
          <TabsTrigger value="equity">Equity ({ledgersData.filter(l => l.category === 'Equity').length})</TabsTrigger>
          <TabsTrigger value="income">Income Statement ({ledgersData.filter(l => ['Revenue', 'Income', 'Expenses'].includes(l.category)).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <DataTable
              data={filteredLedgers}
              columns={columns}
              searchable={false}
              pagination
              pageSize={10}
              emptyMessage={
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Filter className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No ledgers found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="assets">
          <DataTable
            data={filteredLedgers.filter(l => l.category === 'Assets')}
            columns={columns}
            searchable={false}
            pagination
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="liabilities">
          <DataTable
            data={filteredLedgers.filter(l => l.category === 'Liabilities')}
            columns={columns}
            searchable={false}
            pagination
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="equity">
          <DataTable
            data={filteredLedgers.filter(l => l.category === 'Equity')}
            columns={columns}
            searchable={false}
            pagination
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="income">
          <DataTable
            data={filteredLedgers.filter(l => ['Revenue', 'Income', 'Expenses'].includes(l.category))}
            columns={columns}
            searchable={false}
            pagination
            pageSize={10}
          />
        </TabsContent>
      </Tabs>

      {/* Ledger Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={(open) => {
        setShowDetailDialog(open);
        if (!open) document.body.style.pointerEvents = 'auto';
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Ledger Details</DialogTitle>
          </DialogHeader>
          {selectedLedger && (
            <LedgerDetailView
              ledger={selectedLedger}
              defaultTab={activeTab}
              onClose={() => setShowDetailDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) document.body.style.pointerEvents = 'auto';
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account: {selectedLedger?.account}</DialogTitle>
          </DialogHeader>
          {selectedLedger && (
            <EditAccountForm
              ledger={selectedLedger}
              onSuccess={() => {
                setShowEditDialog(false);
                fetchLedgers();
              }}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};