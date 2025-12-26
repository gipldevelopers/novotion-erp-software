'use client';

import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const stats = [
  {
    name: 'Total Customers',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Active Leads',
    value: '847',
    change: '+8.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Revenue',
    value: '$124.5K',
    change: '+23.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Conversion Rate',
    value: '68.4%',
    change: '-2.4%',
    trend: 'down',
    icon: Activity,
    color: 'from-orange-500 to-red-500',
  },
];

const salesData = {
  today: [
    { time: '9 AM', revenue: 1200, leads: 5 },
    { time: '11 AM', revenue: 2400, leads: 8 },
    { time: '1 PM', revenue: 1800, leads: 12 },
    { time: '3 PM', revenue: 3200, leads: 15 },
    { time: '5 PM', revenue: 2800, leads: 10 },
  ],
  week: [
    { day: 'Mon', revenue: 12000, leads: 45 },
    { day: 'Tue', revenue: 15000, leads: 52 },
    { day: 'Wed', revenue: 18000, leads: 48 },
    { day: 'Thu', revenue: 14000, leads: 40 },
    { day: 'Fri', revenue: 22000, leads: 65 },
    { day: 'Sat', revenue: 19000, leads: 55 },
    { day: 'Sun', revenue: 11000, leads: 30 },
  ],
  month: [
    { week: 'Week 1', revenue: 42000, leads: 240 },
    { week: 'Week 2', revenue: 45000, leads: 280 },
    { week: 'Week 3', revenue: 52000, leads: 320 },
    { week: 'Week 4', revenue: 48000, leads: 290 },
  ],
  year: [
    { month: 'Jan', revenue: 42000, leads: 240 },
    { month: 'Feb', revenue: 45000, leads: 280 },
    { month: 'Mar', revenue: 52000, leads: 320 },
    { month: 'Apr', revenue: 48000, leads: 290 },
    { month: 'May', revenue: 61000, leads: 380 },
    { month: 'Jun', revenue: 58000, leads: 350 },
    { month: 'Jul', revenue: 55000, leads: 310 },
    { month: 'Aug', revenue: 62000, leads: 390 },
    { month: 'Sep', revenue: 59000, leads: 360 },
    { month: 'Oct', revenue: 65000, leads: 410 },
    { month: 'Nov', revenue: 72000, leads: 450 },
    { month: 'Dec', revenue: 78000, leads: 480 },
  ],
};

const leadStatusData = [
  { name: 'New', value: 234, color: '#3b82f6' },
  { name: 'Contacted', value: 189, color: '#8b5cf6' },
  { name: 'Qualified', value: 156, color: '#10b981' },
  { name: 'Negotiation', value: 98, color: '#f59e0b' },
  { name: 'Closed', value: 170, color: '#ef4444' },
];

const recentActivities = [
  {
    id: 1,
    type: 'call',
    customer: 'Sarah Johnson',
    action: 'Phone call scheduled',
    time: '10 minutes ago',
    status: 'pending',
  },
  {
    id: 2,
    type: 'email',
    customer: 'Michael Chen',
    action: 'Email sent - Follow up',
    time: '1 hour ago',
    status: 'completed',
  },
  {
    id: 3,
    type: 'meeting',
    customer: 'Emma Davis',
    action: 'Meeting completed',
    time: '2 hours ago',
    status: 'completed',
  },
  {
    id: 4,
    type: 'call',
    customer: 'James Wilson',
    action: 'Missed call',
    time: '3 hours ago',
    status: 'overdue',
  },
];

const topCustomers = [
  { name: 'Acme Corp', revenue: '$45,000', deals: 12, growth: '+34%' },
  { name: 'TechStart Inc', revenue: '$38,500', deals: 9, growth: '+28%' },
  { name: 'Global Solutions', revenue: '$32,000', deals: 8, growth: '+18%' },
  { name: 'Innovation Labs', revenue: '$28,900', deals: 7, growth: '+22%' },
];

export default function CRMDashboard() {
  const [timeRange, setTimeRange] = useState('year');

  const getCurrentData = () => {
    return salesData[timeRange as keyof typeof salesData];
  };

  const getXAxisKey = () => {
    switch (timeRange) {
      case 'today': return 'time';
      case 'week': return 'day';
      case 'month': return 'week';
      case 'year': return 'month';
      default: return 'month';
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white p-6 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back! Here's what's happening with your CRM today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.name}
            className="hover:shadow-lg transition-all duration-300 border border-black dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden group"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-6 h-6 text-gray-100" />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
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
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {stat.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Leads Chart */}
        <Card className="border border-black dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-slate-900 dark:text-white">Revenue & Leads Trend</span>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getCurrentData()}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--chart-grid))" vertical={false} />
                <XAxis
                  dataKey={getXAxisKey()}
                  stroke="rgb(var(--chart-text))"
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="rgb(var(--chart-text))"
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--tooltip-bg))',
                    borderColor: 'rgb(var(--tooltip-border))',
                    color: 'rgb(var(--tooltip-text))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: 'rgb(var(--tooltip-text))' }}
                  labelStyle={{ color: 'rgb(var(--tooltip-text))' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue ($)"
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                  name="Leads"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Status Distribution */}
        <Card className="border border-black dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadStatusData}
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
                  {leadStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--tooltip-bg))',
                    borderColor: 'rgb(var(--tooltip-border))',
                    color: 'rgb(var(--tooltip-text))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: 'rgb(var(--tooltip-text))' }}
                  labelStyle={{ color: 'rgb(var(--tooltip-text))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="border border-black dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-slate-900 dark:text-white">Recent Activities</span>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : activity.status === 'pending'
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                  >
                    {activity.type === 'call' && (
                      <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                    {activity.type === 'email' && (
                      <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                    {activity.type === 'meeting' && (
                      <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {activity.customer}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                  {activity.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {activity.status === 'pending' && (
                    <Clock className="w-5 h-5 text-blue-600" />
                  )}
                  {activity.status === 'overdue' && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="border border-black dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-slate-900 dark:text-white">Top Customers</span>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div
                  key={customer.name}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback
                      className={`bg-gradient-to-br ${index === 0
                        ? 'from-blue-500 to-cyan-500'
                        : index === 1
                          ? 'from-purple-500 to-pink-500'
                          : index === 2
                            ? 'from-green-500 to-emerald-500'
                            : 'from-orange-500 to-red-500'
                        } text-white text-sm font-bold`}
                    >
                      #{index + 1}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {customer.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {customer.deals} deals closed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {customer.revenue}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {customer.growth}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
