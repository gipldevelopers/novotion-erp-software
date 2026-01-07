// Updated: 2025-12-27
import { DollarSign, Users, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, } from 'lucide-react';
import { StatCard } from '@/components/erp/StatCard';
import { ERPAreaChart, ERPBarChart, ERPPieChart } from '@/components/erp/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
];
const expenseByCategory = [
    { name: 'Salaries', value: 45000 },
    { name: 'Operations', value: 23000 },
    { name: 'Marketing', value: 12000 },
    { name: 'Utilities', value: 8000 },
    { name: 'Other', value: 5000 },
];
const salesByDepartment = [
    { department: 'Electronics', sales: 42000 },
    { department: 'Clothing', sales: 35000 },
    { department: 'Home', sales: 28000 },
    { department: 'Sports', sales: 22000 },
    { department: 'Books', sales: 15000 },
];
const recentActivities = [
    { id: 1, action: 'Invoice #1234 created', user: 'John Doe', time: '5 min ago', type: 'invoice' },
    { id: 2, action: 'New customer registered', user: 'Jane Smith', time: '15 min ago', type: 'customer' },
    { id: 3, action: 'Payment of $2,500 received', user: 'System', time: '1 hour ago', type: 'payment' },
    { id: 4, action: 'Employee leave approved', user: 'HR Admin', time: '2 hours ago', type: 'hr' },
    { id: 5, action: 'POS sale completed', user: 'Cashier 1', time: '3 hours ago', type: 'pos' },
];
export const DashboardPage = () => {
    return (<div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Welcome back! Here's an overview of your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="$328,500" change="+12.5% from last month" changeType="positive" icon={DollarSign}/>
        <StatCard title="Active Customers" value="2,420" change="+5.2% from last month" changeType="positive" icon={Users}/>
        <StatCard title="Pending Invoices" value="45" change="-8 from last week" changeType="negative" icon={FileText}/>
        <StatCard title="Growth Rate" value="18.2%" change="+2.4% from last quarter" changeType="positive" icon={TrendingUp}/>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionGuard permission="accounting.view">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ERPAreaChart data={revenueData} xKey="month" yKey="revenue" className="h-72"/>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard permission="accounting.view">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ERPPieChart data={expenseByCategory} dataKey="value" nameKey="name" className="h-72"/>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PermissionGuard permission="pos.view">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Sales by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ERPBarChart data={salesByDepartment} xKey="department" yKey="sales" className="h-72"/>
            </CardContent>
          </Card>
        </PermissionGuard>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (<div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'payment'
                ? 'bg-success/10 text-success'
                : activity.type === 'invoice'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'}`}>
                    {activity.type === 'payment' ? (<ArrowUpRight className="h-4 w-4"/>) : activity.type === 'invoice' ? (<FileText className="h-4 w-4"/>) : (<ArrowDownRight className="h-4 w-4"/>)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} · {activity.time}
                    </p>
                  </div>
                </div>))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);
};
