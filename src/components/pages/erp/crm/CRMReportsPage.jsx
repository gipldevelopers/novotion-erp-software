import { Download } from 'lucide-react';
import { StatCard } from '@/components/erp/StatCard';
import { ERPLineChart, ERPBarChart, ERPPieChart } from '@/components/erp/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, TrendingUp, DollarSign } from 'lucide-react';
const conversionData = [
    { month: 'Jul', leads: 45, conversions: 12 },
    { month: 'Aug', leads: 52, conversions: 15 },
    { month: 'Sep', leads: 48, conversions: 14 },
    { month: 'Oct', leads: 61, conversions: 18 },
    { month: 'Nov', leads: 55, conversions: 16 },
    { month: 'Dec', leads: 67, conversions: 22 },
];
const leadsBySource = [
    { name: 'Website', value: 35 },
    { name: 'Referral', value: 25 },
    { name: 'LinkedIn', value: 18 },
    { name: 'Trade Show', value: 12 },
    { name: 'Cold Call', value: 10 },
];
const salesByRep = [
    { rep: 'John Doe', sales: 145000 },
    { rep: 'Jane Smith', sales: 128000 },
    { rep: 'Mike Wilson', sales: 98000 },
    { rep: 'Sarah Brown', sales: 87000 },
    { rep: 'David Lee', sales: 72000 },
];
export const CRMReportsPage = () => {
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">CRM Reports</h1>
          <p className="page-description">Sales and customer analytics</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2"/>
          Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value="2,420" change="+12.5% this month" changeType="positive" icon={Users}/>
        <StatCard title="Active Leads" value="156" change="+8 new this week" changeType="positive" icon={Target}/>
        <StatCard title="Conversion Rate" value="28.5%" change="+3.2% vs last month" changeType="positive" icon={TrendingUp}/>
        <StatCard title="Pipeline Value" value="$485K" change="+$52K this month" changeType="positive" icon={DollarSign}/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads vs Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <ERPLineChart data={conversionData} xKey="month" yKeys={['leads', 'conversions']} colors={['hsl(var(--info))', 'hsl(var(--success))']} className="h-72"/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ERPPieChart data={leadsBySource} dataKey="value" nameKey="name" className="h-72"/>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sales by Representative</CardTitle>
        </CardHeader>
        <CardContent>
          <ERPBarChart data={salesByRep} xKey="rep" yKey="sales" className="h-72"/>
        </CardContent>
      </Card>
    </div>);
};
