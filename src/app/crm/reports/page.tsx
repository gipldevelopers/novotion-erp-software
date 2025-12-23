'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const customerGrowthData = [
  { month: 'Jan', customers: 1420, newCustomers: 145, churnedCustomers: 23 },
  { month: 'Feb', customers: 1542, newCustomers: 167, churnedCustomers: 45 },
  { month: 'Mar', customers: 1689, newCustomers: 189, churnedCustomers: 42 },
  { month: 'Apr', customers: 1856, newCustomers: 201, churnedCustomers: 34 },
  { month: 'May', customers: 2043, newCustomers: 234, churnedCustomers: 47 },
  { month: 'Jun', customers: 2267, newCustomers: 278, churnedCustomers: 54 },
  { month: 'Jul', customers: 2543, newCustomers: 312, churnedCustomers: 36 },
];

const salesFunnelData = [
  { stage: 'Leads', value: 2500, conversion: 100 },
  { stage: 'Contacted', value: 2000, conversion: 80 },
  { stage: 'Qualified', value: 1500, conversion: 60 },
  { stage: 'Proposal', value: 1000, conversion: 40 },
  { stage: 'Negotiation', value: 600, conversion: 24 },
  { stage: 'Closed Won', value: 400, conversion: 16 },
];

const revenueBySegment = [
  { segment: 'Enterprise', revenue: 450000, percentage: 45 },
  { segment: 'Mid-Market', revenue: 300000, percentage: 30 },
  { segment: 'Small Business', revenue: 150000, percentage: 15 },
  { segment: 'Startup', revenue: 100000, percentage: 10 },
];

const followUpPerformance = [
  { team: 'Sales Team A', onTime: 85, late: 10, missed: 5 },
  { team: 'Sales Team B', onTime: 78, late: 15, missed: 7 },
  { team: 'Sales Team C', onTime: 92, late: 6, missed: 2 },
  { team: 'Sales Team D', onTime: 88, late: 8, missed: 4 },
];

const leadSourceData = [
  { name: 'Website', value: 456, color: '#3b82f6' },
  { name: 'Referral', value: 324, color: '#8b5cf6' },
  { name: 'LinkedIn', value: 289, color: '#10b981' },
  { name: 'Trade Show', value: 234, color: '#f59e0b' },
  { name: 'Cold Call', value: 178, color: '#ef4444' },
];

const stats = [
  {
    label: 'Total Revenue',
    value: '$1.2M',
    change: '+23.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Customer Growth',
    value: '+312',
    change: '+18.5%',
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Conversion Rate',
    value: '16%',
    change: '+2.4%',
    trend: 'up',
    icon: Target,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Avg Deal Size',
    value: '$12.5K',
    change: '-3.2%',
    trend: 'down',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
  },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900   :text-white mb-2">
            Reports & Analytics
          </h1>
          <p className="text-slate-600   :text-slate-400">
            Track performance metrics and analyze trends
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-0 shadow-lg bg-white   :bg-slate-800 hover:shadow-xl transition-all duration-300 group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600   :text-slate-400 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-slate-900   :text-white">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Reports */}
      <Tabs defaultValue="customer" className="space-y-6">
        <TabsList className="bg-white   :bg-slate-800 border border-slate-200   :border-slate-700 p-1">
          <TabsTrigger value="customer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Customer Growth
          </TabsTrigger>
          <TabsTrigger value="sales" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Sales Funnel
          </TabsTrigger>
          <TabsTrigger value="followup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            <Target className="w-4 h-4 mr-2" />
            Follow-up Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Growth Chart */}
            <Card className="border-0 shadow-lg bg-white   :bg-slate-800 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900   :text-white">
                    Customer Growth Trend
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50   :bg-blue-950 text-blue-600   :text-blue-400 border-blue-200   :border-blue-800">
                    Last 7 Months
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={customerGrowthData}>
                    <defs>
                      <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="customers"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCustomers)"
                    />
                    <Area
                      type="monotone"
                      dataKey="newCustomers"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorNew)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Lead Sources */}
            <Card className="border-0 shadow-lg bg-white   :bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900   :text-white">Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Segment */}
            <Card className="border-0 shadow-lg bg-white   :bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900   :text-white">Revenue by Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBySegment.map((segment, index) => (
                    <div key={segment.segment} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900   :text-white">
                          {segment.segment}
                        </span>
                        <span className="text-sm font-bold text-slate-900   :text-white">
                          ${(segment.revenue / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="w-full bg-slate-200   :bg-slate-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            index === 0
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              : index === 1
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                              : index === 2
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-orange-500 to-red-500'
                          }`}
                          style={{ width: `${segment.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-600   :text-slate-400">
                        {segment.percentage}% of total revenue
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Funnel */}
            <Card className="border-0 shadow-lg bg-white   :bg-slate-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-slate-900   :text-white">Sales Funnel Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={salesFunnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="stage" type="category" stroke="#64748b" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill="#3b82f6"
                      radius={[0, 8, 8, 0]}
                      name="Number of Leads"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion Metrics */}
            <Card className="border-0 shadow-lg bg-white   :bg-slate-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-slate-900   :text-white">Stage Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {salesFunnelData.map((stage, index) => (
                    <div
                      key={stage.stage}
                      className="p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100   :from-slate-800   :to-slate-700 border border-slate-200   :border-slate-600"
                    >
                      <p className="text-xs text-slate-600   :text-slate-400 mb-1">
                        {stage.stage}
                      </p>
                      <p className="text-2xl font-bold text-slate-900   :text-white mb-1">
                        {stage.conversion}%
                      </p>
                      <p className="text-xs text-slate-500   :text-slate-500">
                        {stage.value} leads
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="followup" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white   :bg-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900   :text-white">Follow-up Performance by Team</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={followUpPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="team" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="onTime" fill="#10b981" name="On Time" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="late" fill="#f59e0b" name="Late" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="missed" fill="#ef4444" name="Missed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {followUpPerformance.map((team, index) => {
              const total = team.onTime + team.late + team.missed;
              const onTimeRate = ((team.onTime / total) * 100).toFixed(1);
              return (
                <Card
                  key={team.team}
                  className="border-0 shadow-lg bg-white   :bg-slate-800 hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
                        index === 0
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                          : index === 1
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                          : index === 2
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                          : 'bg-gradient-to-br from-orange-500 to-red-500'
                      }`}
                    >
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900   :text-white mb-1">
                      {team.team}
                    </h3>
                    <p className="text-3xl font-bold text-slate-900   :text-white mb-2">
                      {onTimeRate}%
                    </p>
                    <p className="text-sm text-slate-600   :text-slate-400">
                      On-time rate
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
