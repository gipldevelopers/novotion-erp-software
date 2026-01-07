// Updated: 2025-12-27
import { useEffect, useState } from 'react';
import { DollarSign, FileText, CreditCard, TrendingUp, TrendingDown, Receipt, } from 'lucide-react';
import { StatCard } from '@/components/erp/StatCard';
import { ERPLineChart, ERPBarChart } from '@/components/erp/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { accountingService } from '@/services/accountingService';

const monthlyData = [
  { month: 'Jan', income: 45000, expenses: 32000 },
  { month: 'Feb', income: 52000, expenses: 35000 },
  { month: 'Mar', income: 48000, expenses: 30000 },
  { month: 'Apr', income: 61000, expenses: 38000 },
  { month: 'May', income: 55000, expenses: 33000 },
  { month: 'Jun', income: 67000, expenses: 42000 },
];

export const AccountingDashboardPage = () => {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    pendingInvoices: 0,
    invoices: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      const invoices = await accountingService.getInvoices();
      const expenses = await accountingService.getExpenses();

      const totalIncome = invoices.reduce((sum, inv) => sum + inv.amount, 0);
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const pendingCount = invoices.filter(inv => inv.status === 'pending').length;

      setStats({
        totalIncome,
        totalExpenses,
        pendingInvoices: pendingCount,
        invoices
      });
    };
    fetchStats();
  }, []);

  const invoicesByStatus = [
    { status: 'Paid', count: stats.invoices.filter(i => i.status === 'paid').length },
    { status: 'Pending', count: stats.invoices.filter(i => i.status === 'pending').length },
    { status: 'Overdue', count: stats.invoices.filter(i => i.status === 'overdue').length },
    { status: 'Draft', count: stats.invoices.filter(i => i.status === 'draft').length },
  ];

  return (<div className="space-y-6 animate-fade-in">
    <div className="page-header">
      <h1 className="page-title">Accounting Dashboard</h1>
      <p className="page-description">Financial overview and key metrics</p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard title="Total Income" value={`$${stats.totalIncome.toLocaleString()}`} change="+12.5%" changeType="positive" icon={TrendingUp} />
      <StatCard title="Total Expenses" value={`$${stats.totalExpenses.toLocaleString()}`} change="+5.8%" changeType="negative" icon={TrendingDown} />
      <StatCard title="Net Profit" value={`$${(stats.totalIncome - stats.totalExpenses).toLocaleString()}`} change="+18.2%" changeType="positive" icon={DollarSign} />
      <StatCard title="Pending Invoices" value={stats.pendingInvoices} change="Live data" changeType="neutral" icon={FileText} />
      <StatCard title="Overdue Payments" value="$12,400" change="12 invoices" changeType="negative" icon={CreditCard} />
      <StatCard title="This Month" value="$67,000" change="+21.8%" changeType="positive" icon={Receipt} />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ERPLineChart data={monthlyData} xKey="month" yKeys={['income', 'expenses']} colors={['hsl(var(--success))', 'hsl(var(--destructive))']} className="h-80" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoices by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ERPBarChart data={invoicesByStatus} xKey="status" yKey="count" className="h-80" />
        </CardContent>
      </Card>
    </div>
  </div>);
};
