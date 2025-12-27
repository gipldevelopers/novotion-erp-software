// Updated: 2025-12-27
import { ERPBarChart } from '@/components/erp/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/erp/StatCard';
import { ShoppingCart, DollarSign, TrendingUp, Receipt } from 'lucide-react';
const salesData = [
    { hour: '9AM', sales: 450 }, { hour: '10AM', sales: 780 }, { hour: '11AM', sales: 1200 }, { hour: '12PM', sales: 1650 },
    { hour: '1PM', sales: 1420 }, { hour: '2PM', sales: 980 }, { hour: '3PM', sales: 1100 }, { hour: '4PM', sales: 1350 }, { hour: '5PM', sales: 890 },
];
export const POSReportsPage = () => (<div className="space-y-6 animate-fade-in">
    <div className="page-header"><h1 className="page-title">POS Reports</h1><p className="page-description">Sales analytics and insights</p></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Today's Sales" value="$8,420" change="+15.2%" changeType="positive" icon={DollarSign}/>
      <StatCard title="Transactions" value="142" change="+12 vs yesterday" changeType="positive" icon={ShoppingCart}/>
      <StatCard title="Avg. Transaction" value="$59.30" change="+$4.20" changeType="positive" icon={Receipt}/>
      <StatCard title="Growth" value="18.5%" change="+2.1%" changeType="positive" icon={TrendingUp}/>
    </div>
    <Card><CardHeader><CardTitle>Sales by Hour</CardTitle></CardHeader><CardContent><ERPBarChart data={salesData} xKey="hour" yKey="sales" className="h-72"/></CardContent></Card>
  </div>);
