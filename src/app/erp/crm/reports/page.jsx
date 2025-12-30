// Updated: 2025-12-27
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ScatterChart, Scatter, ZAxis, ComposedChart,
    Treemap, FunnelChart, Funnel
} from 'recharts';
import {
    Download,
    Filter,
    Calendar,
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    Target,
    PieChart as PieChartIcon,
    BarChart3,
    LineChart as LineChartIcon,
    Sparkles,
    RefreshCw,
    AlertCircle,
    Eye,
    Printer,
    Share2,
    MoreVertical,
    Clock,
    CheckCircle2,
    XCircle,
    Activity,
    Globe,
    Smartphone,
    Mail,
    Building2,
    UserPlus,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Star
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Theme Colors (Consistent with your design system)
const THEME_COLORS = {
    primary: '#3b82f6',    // Blue-500
    secondary: '#8b5cf6',  // Purple-500
    success: '#10b981',    // Emerald-500
    warning: '#f59e0b',    // Amber-500
    danger: '#ef4444',     // Red-500
    info: '#06b6d4',       // Cyan-500
    dark: '#1f2937',       // Gray-800
    light: '#f8fafc'       // Gray-50
};

const CHART_COLORS = [
    THEME_COLORS.primary,
    THEME_COLORS.secondary,
    THEME_COLORS.success,
    THEME_COLORS.warning,
    THEME_COLORS.danger,
    THEME_COLORS.info,
    '#f97316', // Orange
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#14b8a6', // Teal
];

// Mock Data for Charts
const monthlySalesData = [
    { month: 'Jan', sales: 4200, leads: 2800, customers: 120, revenue: 125000 },
    { month: 'Feb', sales: 3800, leads: 3100, customers: 145, revenue: 118000 },
    { month: 'Mar', sales: 5200, leads: 4200, customers: 189, revenue: 156000 },
    { month: 'Apr', sales: 4800, leads: 3900, customers: 167, revenue: 144000 },
    { month: 'May', sales: 6100, leads: 5200, customers: 234, revenue: 183000 },
    { month: 'Jun', sales: 5800, leads: 4800, customers: 210, revenue: 174000 },
    { month: 'Jul', sales: 7200, leads: 6100, customers: 278, revenue: 216000 },
    { month: 'Aug', sales: 6900, leads: 5900, customers: 256, revenue: 207000 },
    { month: 'Sep', sales: 8100, leads: 7200, customers: 312, revenue: 243000 },
    { month: 'Oct', sales: 7800, leads: 6800, customers: 298, revenue: 234000 },
    { month: 'Nov', sales: 9200, leads: 8500, customers: 356, revenue: 276000 },
    { month: 'Dec', sales: 8900, leads: 8200, customers: 341, revenue: 267000 },
];

const revenueBySourceData = [
    { name: 'Website', value: 45, fill: CHART_COLORS[0] },
    { name: 'Referrals', value: 25, fill: CHART_COLORS[1] },
    { name: 'Social Media', value: 15, fill: CHART_COLORS[2] },
    { name: 'Email Campaigns', value: 10, fill: CHART_COLORS[3] },
    { name: 'Events', value: 5, fill: CHART_COLORS[4] },
];

const leadConversionData = [
    { stage: 'New Leads', value: 1000, fill: CHART_COLORS[0] },
    { stage: 'Contacted', value: 750, fill: CHART_COLORS[1] },
    { stage: 'Qualified', value: 450, fill: CHART_COLORS[2] },
    { stage: 'Proposal', value: 280, fill: CHART_COLORS[3] },
    { stage: 'Negotiation', value: 180, fill: CHART_COLORS[4] },
    { stage: 'Closed Won', value: 120, fill: CHART_COLORS[5] },
];

const customerSatisfactionData = [
    { metric: 'Response Time', score: 85, fullMark: 100 },
    { metric: 'Product Quality', score: 92, fullMark: 100 },
    { metric: 'Support', score: 78, fullMark: 100 },
    { metric: 'Pricing', score: 88, fullMark: 100 },
    { metric: 'Ease of Use', score: 95, fullMark: 100 },
    { metric: 'Overall Value', score: 90, fullMark: 100 },
];

const teamPerformanceData = [
    { name: 'Alex Johnson', deals: 42, value: 250000, efficiency: 92 },
    { name: 'Sarah Miller', deals: 38, value: 220000, efficiency: 88 },
    { name: 'Mike Chen', deals: 35, value: 210000, efficiency: 85 },
    { name: 'Emma Davis', deals: 28, value: 180000, efficiency: 82 },
    { name: 'James Wilson', deals: 31, value: 195000, efficiency: 87 },
];

const quarterlyGrowthData = [
    { quarter: 'Q1', salesGrowth: 12, leadGrowth: 18, customerGrowth: 15 },
    { quarter: 'Q2', salesGrowth: 18, leadGrowth: 22, customerGrowth: 20 },
    { quarter: 'Q3', salesGrowth: 25, leadGrowth: 30, customerGrowth: 28 },
    { quarter: 'Q4', salesGrowth: 32, leadGrowth: 35, customerGrowth: 33 },
];

export default function ReportsPage() {
    const [timeRange, setTimeRange] = useState('year');
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [animatedCharts, setAnimatedCharts] = useState(false);

    // Toggle chart animations
    useEffect(() => {
        const timer = setTimeout(() => setAnimatedCharts(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleExport = (format) => {
        toast.success(`Exporting report as ${format.toUpperCase()}...`);
        // Implement export logic
    };

    const stats = {
        totalRevenue: '₹2,854,000',
        revenueGrowth: 24.5,
        totalLeads: 62800,
        leadGrowth: 18.2,
        conversionRate: 12.8,
        conversionGrowth: 3.2,
        customerSatisfaction: 89.2,
        satisfactionGrowth: 2.1,
        avgDealSize: '₹42,500',
        dealSizeGrowth: 8.7,
        activeCustomers: 2341,
        customerGrowth: 15.3,
        monthlyRecurring: '₹245,000',
        mrrGrowth: 32.1,
    };

    const renderCustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="flex items-center gap-2 text-sm" style={{ color: entry.color }}>
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.dataKey}: <span className="font-semibold">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderMiniChart = (data, dataKey, color, title) => (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={80}>
                    <LineChart data={data}>
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            animationDuration={1500}
                            animationBegin={animatedCharts ? 300 : 0}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">CRM Analytics Dashboard</h2>
                    <p className="text-muted-foreground">Advanced insights and performance metrics</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[140px]">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                    </Select>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                <FileText className="mr-2 h-4 w-4" /> PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('excel')}>
                                <Table className="mr-2 h-4 w-4" /> Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('csv')}>
                                <Download className="mr-2 h-4 w-4" /> CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={() => setIsLoading(true)}>
                        <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">{stats.totalRevenue}</p>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-sm font-semibold",
                                stats.revenueGrowth >= 0 ? "text-emerald-600" : "text-rose-600"
                            )}>
                                {stats.revenueGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                {Math.abs(stats.revenueGrowth)}%
                            </div>
                        </div>
                        <Progress value={stats.revenueGrowth} className="h-1.5 mt-4" />
                        <p className="text-xs text-muted-foreground mt-2">Year over year growth</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                                <p className="text-2xl font-bold">{stats.activeCustomers.toLocaleString()}</p>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-sm font-semibold",
                                stats.customerGrowth >= 0 ? "text-emerald-600" : "text-rose-600"
                            )}>
                                {stats.customerGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                {Math.abs(stats.customerGrowth)}%
                            </div>
                        </div>
                        <Progress value={stats.customerGrowth} className="h-1.5 mt-4" />
                        <p className="text-xs text-muted-foreground mt-2">Monthly growth rate</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-sm font-semibold",
                                stats.conversionGrowth >= 0 ? "text-emerald-600" : "text-rose-600"
                            )}>
                                {stats.conversionGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                {Math.abs(stats.conversionGrowth)}%
                            </div>
                        </div>
                        <Progress value={stats.conversionRate} className="h-1.5 mt-4" />
                        <p className="text-xs text-muted-foreground mt-2">Lead to customer rate</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Customer Satisfaction</p>
                                <p className="text-2xl font-bold">{stats.customerSatisfaction}%</p>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-sm font-semibold",
                                stats.satisfactionGrowth >= 0 ? "text-emerald-600" : "text-rose-600"
                            )}>
                                {stats.satisfactionGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                {Math.abs(stats.satisfactionGrowth)}%
                            </div>
                        </div>
                        <Progress value={stats.customerSatisfaction} className="h-1.5 mt-4" />
                        <p className="text-xs text-muted-foreground mt-2">Based on 1,243 reviews</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Main Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Revenue Trend</CardTitle>
                                <CardDescription>Monthly revenue performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <ComposedChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                        <Tooltip content={renderCustomTooltip} />
                                        <Legend />
                                        <Bar
                                            dataKey="revenue"
                                            fill={THEME_COLORS.primary}
                                            radius={[4, 4, 0, 0]}
                                            animationDuration={2000}
                                            animationBegin={animatedCharts ? 0 : 0}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="sales"
                                            stroke={THEME_COLORS.secondary}
                                            strokeWidth={2}
                                            dot={{ strokeWidth: 2, r: 4 }}
                                            animationDuration={2000}
                                            animationBegin={animatedCharts ? 300 : 0}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Revenue by Source</CardTitle>
                                <CardDescription>Distribution across channels</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={revenueBySourceData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationDuration={1500}
                                            animationBegin={animatedCharts ? 0 : 0}
                                        >
                                            {revenueBySourceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value}%`, 'Revenue']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Mini Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {renderMiniChart(monthlySalesData.slice(-6), 'leads', THEME_COLORS.success, 'Lead Growth')}
                        {renderMiniChart(monthlySalesData.slice(-6), 'customers', THEME_COLORS.warning, 'New Customers')}
                        {renderMiniChart(monthlySalesData.slice(-6), 'sales', THEME_COLORS.danger, 'Deals Closed')}
                    </div>

                    {/* Funnel Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Conversion Funnel</CardTitle>
                            <CardDescription>Customer journey from lead to sale</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <FunnelChart>
                                    <Tooltip />
                                    <Funnel
                                        dataKey="value"
                                        data={leadConversionData}
                                        isAnimationActive={animatedCharts}
                                        animationDuration={1500}
                                        label
                                    >
                                        {leadConversionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Funnel>
                                </FunnelChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Sales Tab */}
                <TabsContent value="sales" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Performance</CardTitle>
                                <CardDescription>Sales representatives performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="deals" fill={CHART_COLORS[0]} name="Deals Closed" />
                                        <Bar yAxisId="right" dataKey="efficiency" fill={CHART_COLORS[1]} name="Efficiency %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quarterly Growth</CardTitle>
                                <CardDescription>Quarter-over-quarter performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <RadarChart data={customerSatisfactionData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="metric" />
                                        <PolarRadiusAxis />
                                        <Radar
                                            name="Customer Satisfaction"
                                            dataKey="score"
                                            stroke={THEME_COLORS.primary}
                                            fill={THEME_COLORS.primary}
                                            fillOpacity={0.6}
                                            animationDuration={2000}
                                            animationBegin={animatedCharts ? 0 : 0}
                                        />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Deal Size Distribution</CardTitle>
                            <CardDescription>Distribution of deal values</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid />
                                    <XAxis type="number" dataKey="deals" name="Deals" unit=" deals" />
                                    <YAxis type="number" dataKey="value" name="Value" unit="₹" />
                                    <ZAxis type="number" dataKey="efficiency" range={[60, 400]} name="Efficiency" unit="%" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Scatter
                                        name="Sales Reps"
                                        data={teamPerformanceData}
                                        fill={THEME_COLORS.primary}
                                        animationDuration={2000}
                                        animationBegin={animatedCharts ? 0 : 0}
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Customers Tab */}
                <TabsContent value="customers" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Acquisition Cost</CardTitle>
                                <CardDescription>Cost to acquire new customers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart data={monthlySalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="customers"
                                            stroke={THEME_COLORS.success}
                                            fill={THEME_COLORS.success}
                                            fillOpacity={0.3}
                                            animationDuration={2000}
                                            animationBegin={animatedCharts ? 0 : 0}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Lifetime Value</CardTitle>
                                <CardDescription>Projected value over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={monthlySalesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke={THEME_COLORS.primary}
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                            animationDuration={2000}
                                            animationBegin={animatedCharts ? 0 : 0}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="customers"
                                            stroke={THEME_COLORS.secondary}
                                            strokeWidth={2}
                                            animationDuration={2000}
                                            animationBegin={animatedCharts ? 300 : 0}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Key Metrics */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Detailed breakdown of key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-medium">Win Rate</span>
                                </div>
                                <span className="text-lg font-bold">32.4%</span>
                            </div>
                            <Progress value={32.4} className="h-2" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                                    <span className="text-sm font-medium">Avg Deal Cycle</span>
                                </div>
                                <span className="text-lg font-bold">24 days</span>
                            </div>
                            <Progress value={65} className="h-2" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                                    <span className="text-sm font-medium">Lead Response</span>
                                </div>
                                <span className="text-lg font-bold">2.4 hrs</span>
                            </div>
                            <Progress value={85} className="h-2" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                                    <span className="text-sm font-medium">Customer Retention</span>
                                </div>
                                <span className="text-lg font-bold">94.2%</span>
                            </div>
                            <Progress value={94.2} className="h-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { action: 'New deal closed', user: 'Alex Johnson', amount: '₹42,500', time: '2 hours ago', type: 'success' },
                            { action: 'Lead converted', user: 'Sarah Miller', amount: '₹28,000', time: '4 hours ago', type: 'success' },
                            { action: 'Campaign launched', user: 'Marketing Team', amount: null, time: '1 day ago', type: 'info' },
                            { action: 'Customer complaint', user: 'Support Team', amount: null, time: '2 days ago', type: 'warning' },
                            { action: 'Contract renewed', user: 'Mike Chen', amount: '₹156,000', time: '3 days ago', type: 'success' },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center",
                                        activity.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                            activity.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                                'bg-blue-100 text-blue-600'
                                    )}>
                                        {activity.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> :
                                            activity.type === 'warning' ? <AlertCircle className="h-4 w-4" /> :
                                                <Activity className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium">{activity.action}</p>
                                        <p className="text-sm text-muted-foreground">By {activity.user} • {activity.time}</p>
                                    </div>
                                </div>
                                {activity.amount && (
                                    <Badge variant="outline" className="font-semibold">
                                        {activity.amount}
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper component for file icons
const FileText = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const Table = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);