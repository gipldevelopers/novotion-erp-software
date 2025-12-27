import { Download, Calendar } from 'lucide-react';
import { StatCard } from '@/components/erp/StatCard';
import { ERPLineChart, ERPBarChart, ERPPieChart } from '@/components/erp/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
const monthlyPL = [
    { month: 'Jul', income: 42000, expenses: 28000, profit: 14000 },
    { month: 'Aug', income: 45000, expenses: 30000, profit: 15000 },
    { month: 'Sep', income: 48000, expenses: 32000, profit: 16000 },
    { month: 'Oct', income: 52000, expenses: 35000, profit: 17000 },
    { month: 'Nov', income: 58000, expenses: 38000, profit: 20000 },
    { month: 'Dec', income: 67000, expenses: 42000, profit: 25000 },
];
const incomeBySource = [
    { name: 'Product Sales', value: 180000 },
    { name: 'Services', value: 95000 },
    { name: 'Subscriptions', value: 42000 },
    { name: 'Consulting', value: 28000 },
    { name: 'Other', value: 12000 },
];
const expensesByCategory = [
    { category: 'Salaries', amount: 120000 },
    { category: 'Rent', amount: 42000 },
    { category: 'Marketing', amount: 35000 },
    { category: 'Utilities', amount: 12000 },
    { category: 'Supplies', amount: 8000 },
    { category: 'Other', amount: 18000 },
];
export const ReportsPage = () => {
    const totalIncome = monthlyPL.reduce((sum, m) => sum + m.income, 0);
    const totalExpenses = monthlyPL.reduce((sum, m) => sum + m.expenses, 0);
    const totalProfit = totalIncome - totalExpenses;
    const profitMargin = ((totalProfit / totalIncome) * 100).toFixed(1);
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Financial Reports</h1>
          <p className="page-description">Comprehensive financial analysis and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="6months">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2"/>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2"/>
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Income" value={`$${(totalIncome / 1000).toFixed(0)}K`} change="+18.5% vs last period" changeType="positive" icon={TrendingUp}/>
        <StatCard title="Total Expenses" value={`$${(totalExpenses / 1000).toFixed(0)}K`} change="+12.3% vs last period" changeType="negative" icon={TrendingDown}/>
        <StatCard title="Net Profit" value={`$${(totalProfit / 1000).toFixed(0)}K`} change="+28.4% vs last period" changeType="positive" icon={DollarSign}/>
        <StatCard title="Profit Margin" value={`${profitMargin}%`} change="+2.1% vs last period" changeType="positive" icon={Percent}/>
      </div>

      {/* P&L Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profit & Loss Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ERPLineChart data={monthlyPL} xKey="month" yKeys={['income', 'expenses', 'profit']} colors={['hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--primary))']} className="h-80"/>
        </CardContent>
      </Card>

      {/* Income & Expenses Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Income by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ERPPieChart data={incomeBySource} dataKey="value" nameKey="name" className="h-72"/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ERPBarChart data={expensesByCategory} xKey="category" yKey="amount" color="hsl(var(--destructive))" className="h-72"/>
          </CardContent>
        </Card>
      </div>
    </div>);
};
