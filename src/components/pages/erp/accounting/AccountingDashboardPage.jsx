import { DollarSign, FileText, CreditCard, TrendingUp, TrendingDown, Receipt, } from 'lucide-react';
import { StatCard } from '@/components/erp/StatCard';
import { ERPLineChart, ERPBarChart } from '@/components/erp/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const monthlyData = [
    { month: 'Jan', income: 45000, expenses: 32000 },
    { month: 'Feb', income: 52000, expenses: 35000 },
    { month: 'Mar', income: 48000, expenses: 30000 },
    { month: 'Apr', income: 61000, expenses: 38000 },
    { month: 'May', income: 55000, expenses: 33000 },
    { month: 'Jun', income: 67000, expenses: 42000 },
];
const invoicesByStatus = [
    { status: 'Paid', count: 145 },
    { status: 'Pending', count: 42 },
    { status: 'Overdue', count: 12 },
    { status: 'Draft', count: 8 },
];
export const AccountingDashboardPage = () => {
    return (<div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Accounting Dashboard</h1>
        <p className="page-description">Financial overview and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Income" value="$328,500" change="+12.5%" changeType="positive" icon={TrendingUp}/>
        <StatCard title="Total Expenses" value="$210,200" change="+5.8%" changeType="negative" icon={TrendingDown}/>
        <StatCard title="Net Profit" value="$118,300" change="+18.2%" changeType="positive" icon={DollarSign}/>
        <StatCard title="Pending Invoices" value="$45,600" change="42 invoices" changeType="neutral" icon={FileText}/>
        <StatCard title="Overdue Payments" value="$12,400" change="12 invoices" changeType="negative" icon={CreditCard}/>
        <StatCard title="This Month" value="$67,000" change="+21.8%" changeType="positive" icon={Receipt}/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ERPLineChart data={monthlyData} xKey="month" yKeys={['income', 'expenses']} colors={['hsl(var(--success))', 'hsl(var(--destructive))']} className="h-80"/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoices by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ERPBarChart data={invoicesByStatus} xKey="status" yKey="count" className="h-80"/>
          </CardContent>
        </Card>
      </div>
    </div>);
};
