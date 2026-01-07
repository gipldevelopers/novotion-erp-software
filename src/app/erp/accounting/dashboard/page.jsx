'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Download,
  Upload,
  CreditCard,
  FileText,
  MoreHorizontal,
  Search,
  Bell,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  BarChart3,
  PieChart,
  Calendar,
  Users,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Zap,
  Target,
  Award,
  Shield,
  LineChart,
  Activity,
  Banknote,
  Receipt,
  Calculator,
  FileSpreadsheet,
  Printer,
  Share2,
  DownloadCloud,
  Cloud,
  Database,
  Layers,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Recharts for beautiful graphs
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Services
import { accountingService } from '@/services/accountingService';
import { expenseService } from '@/services/expenseService';
import { reportService } from '@/services/reportService';
import { taxationService } from '@/services/taxationService';

// Custom Components (enhanced versions)
import { RevenueChart } from '@/components/accounting/RevenueChart';
import { ExpenseBreakdown } from '@/components/accounting/ExpenseBreakdown';
import { RecentTransactions } from '@/components/accounting/RecentTransactions';
import { AccountWatchlist } from '@/components/accounting/AccountWatchlist';
import { PendingActions } from '@/components/accounting/PendingActions';
import { FinancialCalendar } from '@/components/accounting/FinancialCalendar';

export default function AccountingDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month'); // day, week, month, quarter, year
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, analytics
  const [data, setData] = useState({
    invoices: [],
    expenses: [],
    revenue: null,
    expenseAnalysis: null,
    gst: null,
    accounts: [],
    revenueTrend: [],
    accountBalances: [],
    recentTransactions: [],
    pendingInvoices: [],
    upcomingPayments: [],
    financialMetrics: {}
  });

  // Generate sample revenue trend data
  const generateRevenueTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => {
      const baseRevenue = 500000;
      const growth = 1 + (index * 0.08); // 8% monthly growth
      const seasonality = Math.sin(index * 0.5) * 0.2 + 1; // Seasonal variation
      const randomFactor = 0.9 + Math.random() * 0.2; // Random factor
      
      const revenue = Math.round(baseRevenue * growth * seasonality * randomFactor);
      const expenses = Math.round(revenue * (0.55 - (index * 0.01))); // Decreasing expense ratio
      const profit = revenue - expenses;
      
      return {
        month,
        revenue,
        expenses,
        profit,
        target: Math.round(baseRevenue * growth * 1.1), // 10% above trend
        customers: Math.round(50 + (index * 5)), // Growing customer base
        growthRate: (index === 0 ? 0 : Math.round(((revenue / (baseRevenue * growth * 0.92)) - 1) * 100))
      };
    });
  }, []);

  // Generate expense breakdown data
  const generateExpenseBreakdownData = useMemo(() => {
    return [
      { name: 'Salaries', value: 45, amount: 2250000, color: '#3b82f6', icon: '👨‍💼' },
      { name: 'Marketing', value: 20, amount: 1000000, color: '#10b981', icon: '📢' },
      { name: 'Operations', value: 15, amount: 750000, color: '#f59e0b', icon: '⚙️' },
      { name: 'Software', value: 10, amount: 500000, color: '#8b5cf6', icon: '💻' },
      { name: 'Office Rent', value: 5, amount: 250000, color: '#ef4444', icon: '🏢' },
      { name: 'Utilities', value: 5, amount: 250000, color: '#ec4899', icon: '💡' }
    ];
  }, []);

  // Generate account balances
  const generateAccountBalances = useMemo(() => {
    return [
      { id: 1, name: 'HDFC Business', type: 'Bank', balance: 1250000, status: 'active', lastSync: 'Just now', color: '#3b82f6' },
      { id: 2, name: 'ICICI Current', type: 'Bank', balance: 850000, status: 'active', lastSync: '2 hours ago', color: '#10b981' },
      { id: 3, name: 'PayPal', type: 'Digital', balance: 250000, status: 'active', lastSync: 'Today', color: '#8b5cf6' },
      { id: 4, name: 'Cash in Hand', type: 'Cash', balance: 150000, status: 'active', lastSync: 'Updated', color: '#f59e0b' },
      { id: 5, name: 'Accounts Receivable', type: 'Receivable', balance: 750000, status: 'pending', lastSync: '2 days ago', color: '#ec4899' }
    ];
  }, []);

  // Generate recent transactions
  const generateRecentTransactions = useMemo(() => {
    const transactions = [
      { id: 'INV-2024-001', type: 'invoice', amount: 50000, date: '2024-01-15', status: 'paid', customer: 'TechCorp Inc.', category: 'Services' },
      { id: 'EXP-2024-001', type: 'expense', amount: -15000, date: '2024-01-14', status: 'verified', vendor: 'Amazon Web Services', category: 'Software' },
      { id: 'PMT-2024-001', type: 'payment', amount: 75000, date: '2024-01-14', status: 'received', customer: 'Global Solutions', category: 'Payment' },
      { id: 'REF-2024-001', type: 'refund', amount: -5000, date: '2024-01-13', status: 'processed', customer: 'John Doe', category: 'Refund' },
      { id: 'INV-2024-002', type: 'invoice', amount: 35000, date: '2024-01-13', status: 'pending', customer: 'Startup Labs', category: 'Products' },
      { id: 'EXP-2024-002', type: 'expense', amount: -8000, date: '2024-01-12', status: 'verified', vendor: 'Google Cloud', category: 'Infrastructure' },
      { id: 'PMT-2024-002', type: 'payment', amount: 45000, date: '2024-01-12', status: 'received', customer: 'Enterprise Corp', category: 'Payment' },
      { id: 'TRF-2024-001', type: 'transfer', amount: -20000, date: '2024-01-11', status: 'completed', from: 'HDFC', to: 'ICICI', category: 'Transfer' }
    ];
    
    // Sort by date (newest first)
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  // Generate pending invoices
  const generatePendingInvoices = useMemo(() => {
    return [
      { id: 'INV-001', customer: 'TechCorp Inc.', amount: 50000, dueDate: '2024-01-20', status: 'pending', daysLeft: 5 },
      { id: 'INV-002', customer: 'Startup Labs', amount: 35000, dueDate: '2024-01-18', status: 'overdue', daysLeft: -2 },
      { id: 'INV-003', customer: 'Global Solutions', amount: 75000, dueDate: '2024-01-25', status: 'pending', daysLeft: 10 },
      { id: 'INV-004', customer: 'Digital Media', amount: 25000, dueDate: '2024-01-22', status: 'pending', daysLeft: 7 },
      { id: 'INV-005', customer: 'Cloud Systems', amount: 42000, dueDate: '2024-01-19', status: 'pending', daysLeft: 4 }
    ];
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls with realistic data
      setTimeout(() => {
        const revenue = generateRevenueTrendData.reduce((sum, item) => sum + item.revenue, 0);
        const expenses = generateRevenueTrendData.reduce((sum, item) => sum + item.expenses, 0);
        const profit = revenue - expenses;
        const previousRevenue = revenue * 0.85;
        const previousExpenses = expenses * 0.9;
        const previousProfit = previousRevenue - previousExpenses;

        const stats = {
          totalAssets: 2500000,
          totalLiabilities: 1250000,
          totalIncome: revenue,
          totalExpenses: expenses,
          netProfit: profit,
          cashFlow: revenue - expenses,
          pendingInvoices: generatePendingInvoices.length,
          overdueInvoices: generatePendingInvoices.filter(inv => inv.status === 'overdue').length,
          activeAccounts: generateAccountBalances.filter(acc => acc.status === 'active').length,
          reconciliationRate: 85
        };

        const gstData = {
          payment: {
            taxPayable: 125000,
            interest: 0,
            penalty: 0,
            total: 125000
          },
          eligibleITC: {
            totalITC: 75000,
            igst: 45000,
            cgst: 15000,
            sgst: 15000
          },
          netPayable: 50000,
          dueDate: '2024-01-20',
          status: 'safe',
          filingStatus: 'pending'
        };

        setData({
          invoices: generatePendingInvoices,
          expenses: generateExpenseBreakdownData,
          revenue: { totalRevenue: revenue, monthlyData: generateRevenueTrendData },
          expenseAnalysis: { totalExpense: expenses, breakdown: generateExpenseBreakdownData },
          gst: gstData,
          accounts: generateAccountBalances,
          revenueTrend: generateRevenueTrendData,
          accountBalances: generateAccountBalances,
          recentTransactions: generateRecentTransactions,
          pendingInvoices: generatePendingInvoices,
          upcomingPayments: [],
          financialMetrics: {
            currentRatio: 2.5,
            debtToEquity: 0.3,
            grossMargin: 65,
            netMargin: 28,
            roi: 22,
            customerGrowth: 15,
            arTurnover: 8.5
          },
          stats
        });

        setLoading(false);
      }, 800);

    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid':
      case 'active':
      case 'completed':
      case 'received':
      case 'safe':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'overdue':
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'verified':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'invoice':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'expense':
        return <Receipt className="h-4 w-4 text-red-600" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-amber-600" />;
      case 'transfer':
        return <Banknote className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Financial Dashboard</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>FY 2024-25 • Q3 • {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span>
                <Badge variant="outline" className="text-xs">Live Data</Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search transactions..." 
              className="pl-10 w-[200px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" 
            />
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={loadDashboardData} className="h-10 w-10">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => router.push('/erp/accounting/invoices/create')} 
            className="bg-primary hover:bg-primary/80 text-white h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">+12.5%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(data.stats?.totalIncome || 0)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Last month: {formatCurrency((data.stats?.totalIncome || 0) * 0.85)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-4 w-4" />
                <span className="font-semibold">-5.2%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(data.stats?.totalExpenses || 0)}</p>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={65} className="h-2 flex-1" />
                <span className="text-xs text-gray-500">65% of revenue</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="font-semibold">+18.3%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(data.stats?.netProfit || 0)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Margin: 28%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Banknote className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">+8.7%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cash Flow</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(data.stats?.cashFlow || 0)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.pendingInvoices.length} pending invoices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend - Full width in first column */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-600" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly performance and growth</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {dateRange === 'month' ? 'Monthly' : 
                   dateRange === 'quarter' ? 'Quarterly' : 
                   dateRange === 'year' ? 'Yearly' : 'Weekly'} View
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>This Month</DropdownMenuItem>
                    <DropdownMenuItem>Last Quarter</DropdownMenuItem>
                    <DropdownMenuItem>Year to Date</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={data.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Amount']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue"
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    name="Expenses"
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    name="Profit"
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Quick Stats below chart */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Monthly</p>
                <p className="text-lg font-bold">
                  {formatCurrency(data.revenueTrend.reduce((acc, curr) => acc + curr.revenue, 0) / data.revenueTrend.length)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                <p className="text-lg font-bold text-green-600">
                  {data.revenueTrend.length > 1 ? 
                    ((data.revenueTrend[data.revenueTrend.length - 1].revenue - data.revenueTrend[0].revenue) / data.revenueTrend[0].revenue * 100).toFixed(1) + '%' 
                    : '0%'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Peak Revenue</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(Math.max(...data.revenueTrend.map(d => d.revenue)))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-red-600" />
                  Expense Breakdown
                </CardTitle>
                <CardDescription>This month's spending</CardDescription>
              </div>
              <Badge variant="outline">{formatCurrency(data.stats?.totalExpenses || 0)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data.expenseAnalysis?.breakdown || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(data.expenseAnalysis?.breakdown || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}% (${formatCurrency(props.payload.amount)})`,
                      name
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Expense list */}
            <div className="space-y-3 mt-4">
              {(data.expenseAnalysis?.breakdown || []).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{item.value}%</span>
                    <div className="text-xs text-gray-500">{formatCurrency(item.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid - Transactions & Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Latest financial activities</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push('/erp/accounting/transactions')}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.id}</p>
                            <p className="text-xs text-gray-500">{transaction.customer || transaction.vendor || transaction.from}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(transaction.date).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(transaction.status)} text-xs capitalize`}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileSpreadsheet className="h-4 w-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Account Balances */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wallet className="h-4 w-4" />
                Account Balances
                <Badge variant="outline" className="ml-auto">{data.accountBalances.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.accountBalances.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8" style={{ backgroundColor: `${account.color}20` }}>
                        <AvatarFallback className="text-xs" style={{ color: account.color }}>
                          {account.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{account.name}</p>
                        <p className="text-xs text-gray-500">{account.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(account.balance)}</p>
                      <p className="text-xs text-gray-500">{account.lastSync}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline" onClick={() => router.push('/erp/accounting/bank-accounts')}>
                <Banknote className="h-4 w-4 mr-2" />
                Manage Accounts
              </Button>
            </CardContent>
          </Card>

          {/* GST Summary */}
          {data.gst && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  GST Summary
                  <Badge className="ml-auto bg-emerald-500 hover:bg-emerald-600 border-0">Safe</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-300">Net Payable</p>
                    <p className="text-2xl font-bold">{formatCurrency(data.gst.netPayable)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Liability</p>
                      <p className="font-semibold">{formatCurrency(data.gst.payment.taxPayable)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Input Tax</p>
                      <p className="font-semibold">{formatCurrency(data.gst.eligibleITC.totalITC)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Due Date</span>
                    <span>{new Date(data.gst.dueDate).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-slate-700 hover:bg-slate-600" onClick={() => router.push('/erp/accounting/taxation/gst')}>
                  <Calculator className="h-4 w-4 mr-2" />
                  File GST Return
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          Data updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}