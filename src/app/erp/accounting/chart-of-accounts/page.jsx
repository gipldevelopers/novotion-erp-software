'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus, Search, ChevronRight, ChevronDown, Edit, Trash2,
    TrendingUp, TrendingDown, FileSpreadsheet, Printer,
    Filter, Download, Eye, EyeOff, Lock, Unlock,
    MoreVertical, Copy, FolderTree, BarChart3,
    Layers, RefreshCw, AlertCircle, Shield,
    DollarSign, Calendar, Tag, Hash,
    ArrowUpDown, Settings, Users, Building,
    ChevronLeft, ChevronRight as ChevronRightIcon,
    FileText, Wallet, CreditCard, Banknote,
    PieChart, LineChart, BarChart, Activity,
    Share2, Link, QrCode, Database,
    Zap, Target, Globe, ShieldCheck,
    Home, Building2, ShoppingBag, Truck,
    Smartphone, Cpu, Wifi, Cloud,
    Music, Film, Book, Briefcase,
    Heart, Star, Moon, Sun,
    Palette, Sparkles, Gem,
    Calculator, UserCheck, Clock4, Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { accountingService } from '@/services/accountingService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    LineChart as RechartsLineChart,
    Line,
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell
} from 'recharts';

export default function ChartOfAccountsPage() {
    const router = useRouter();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showZeroBalance, setShowZeroBalance] = useState(false);
    const [showInactive, setShowInactive] = useState(false);
    const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'accounts' | 'analytics' | 'hierarchy' | 'reports'
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'code', direction: 'asc' });
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [bulkActionMode, setBulkActionMode] = useState(false);
    const [balanceRange, setBalanceRange] = useState([0, 1000000]);
    const rowsPerPage = 10;

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            setLoading(true);
            const data = await accountingService.getChartOfAccounts();
            setAccounts(data);

            // Auto-expand first level groups
            const topLevelGroups = data.filter(acc => acc.isGroup && (!acc.parentId || acc.parentId === '')).map(acc => acc.id);
            setExpandedGroups(new Set(topLevelGroups));
        } catch (error) {
            console.error('Error loading accounts:', error);
            // Load demo data if API fails
            loadDemoData();
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortedAccounts = useCallback((accountsList) => {
        if (!sortConfig.key) return accountsList;

        return [...accountsList].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'balance') {
                aValue = Math.abs(a.balance);
                bValue = Math.abs(b.balance);
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [sortConfig]);

    const getFilteredAccounts = useCallback(() => {
        let filtered = accounts;

        if (filterType !== 'all') {
            filtered = filtered.filter(acc => acc.type === filterType);
        }

        if (filterCategory !== 'all') {
            filtered = filtered.filter(acc => acc.category === filterCategory);
        }

        if (!showZeroBalance) {
            filtered = filtered.filter(acc => acc.balance !== 0);
        }

        if (!showInactive) {
            filtered = filtered.filter(acc => acc.isActive !== false);
        }

        // Balance range filter
        filtered = filtered.filter(acc =>
            Math.abs(acc.balance) >= balanceRange[0] &&
            Math.abs(acc.balance) <= balanceRange[1]
        );

        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            filtered = filtered.filter(acc =>
                acc.name.toLowerCase().includes(query) ||
                acc.code.toLowerCase().includes(query) ||
                acc.description?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [accounts, filterType, filterCategory, showZeroBalance, showInactive, searchTerm, balanceRange]);

    const filteredAccounts = useMemo(() => getFilteredAccounts(), [getFilteredAccounts]);
    const sortedAccounts = useMemo(() => getSortedAccounts(filteredAccounts), [filteredAccounts, getSortedAccounts]);

    // Pagination
    const totalPages = Math.ceil(sortedAccounts.length / rowsPerPage);
    const paginatedAccounts = sortedAccounts.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Export functions
    const exportToCSV = () => {
        const csvContent = [
            ['Code', 'Name', 'Type', 'Category', 'Balance', 'Is Group', 'Status', 'Created Date', 'Last Transaction'].join(','),
            ...filteredAccounts.map(acc => [
                acc.code,
                `"${acc.name}"`,
                acc.type,
                acc.category || 'Uncategorized',
                acc.balance,
                acc.isGroup ? 'Yes' : 'No',
                acc.isActive ? 'Active' : 'Inactive',
                acc.createdDate || 'N/A',
                acc.lastTransactionDate || 'N/A'
            ].join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chart-of-accounts-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const exportToPDF = () => {
        alert('PDF export functionality would be implemented with a PDF library like jsPDF or @react-pdf/renderer');
    };

    const exportReport = (type) => {
        alert(`${type} report export functionality would be implemented here`);
    };

    const shareDashboard = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Chart of Accounts Dashboard',
                text: 'Check out our Chart of Accounts dashboard',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const getFinancialSummary = useCallback(() => {
        const leafAccounts = filteredAccounts.filter(a => !a.isGroup);

        const assets = leafAccounts.filter(a => a.type === 'Asset');
        const liabilities = leafAccounts.filter(a => a.type === 'Liability');
        const equity = leafAccounts.filter(a => a.type === 'Equity');
        const income = leafAccounts.filter(a => a.type === 'Income');
        const expenses = leafAccounts.filter(a => a.type === 'Expense');

        const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
        const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
        const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);
        const totalIncome = income.reduce((sum, a) => sum + a.balance, 0);
        const totalExpenses = expenses.reduce((sum, a) => sum + a.balance, 0);

        return {
            totalAssets,
            totalLiabilities: Math.abs(totalLiabilities),
            totalEquity,
            totalIncome,
            totalExpenses,
            netWorth: totalAssets - Math.abs(totalLiabilities),
            netProfit: totalIncome - totalExpenses,
            accountCounts: {
                total: filteredAccounts.length,
                active: filteredAccounts.filter(a => a.isActive !== false).length,
                groups: filteredAccounts.filter(a => a.isGroup).length,
                leaf: filteredAccounts.filter(a => !a.isGroup).length,
            }
        };
    }, [filteredAccounts]);

    const summary = getFinancialSummary();
    const netWorth = summary.netWorth;
    const netProfit = summary.netProfit;

    const getTypeColor = (type) => {
        switch (type) {
            case 'Asset': return '#3b82f6'; // Blue
            case 'Liability': return '#ef4444'; // Red
            case 'Equity': return '#8b5cf6'; // Purple
            case 'Income': return '#10b981'; // Green
            case 'Expense': return '#f59e0b'; // Amber
            default: return '#6b7280';
        }
    };

    // Analytics Data
    const analyticsData = useMemo(() => {
        const types = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];
        return types.map(type => {
            const accountsOfType = filteredAccounts.filter(a => a.type === type && !a.isGroup);
            const totalBalance = accountsOfType.reduce((sum, a) => sum + Math.abs(a.balance), 0);
            return {
                type,
                count: accountsOfType.length,
                totalBalance,
                color: getTypeColor(type),
                avgBalance: accountsOfType.length > 0 ? totalBalance / accountsOfType.length : 0
            };
        });
    }, [filteredAccounts]);

    // Chart data
    const accountTypeChartData = [
        { type: 'Assets', value: analyticsData.find(d => d.type === 'Asset')?.count || 0, color: '#3b82f6' },
        { type: 'Liabilities', value: analyticsData.find(d => d.type === 'Liability')?.count || 0, color: '#ef4444' },
        { type: 'Equity', value: analyticsData.find(d => d.type === 'Equity')?.count || 0, color: '#8b5cf6' },
        { type: 'Income', value: analyticsData.find(d => d.type === 'Income')?.count || 0, color: '#10b981' },
        { type: 'Expenses', value: analyticsData.find(d => d.type === 'Expense')?.count || 0, color: '#f59e0b' }
    ];

    const monthlyTrendData = [
        { month: 'Jan', assets: 1500000, liabilities: 800000, income: 500000, expenses: 300000 },
        { month: 'Feb', assets: 1600000, liabilities: 850000, income: 550000, expenses: 320000 },
        { month: 'Mar', assets: 1550000, liabilities: 820000, income: 520000, expenses: 310000 },
        { month: 'Apr', assets: 1650000, liabilities: 880000, income: 580000, expenses: 340000 },
        { month: 'May', assets: 1700000, liabilities: 900000, income: 600000, expenses: 350000 },
        { month: 'Jun', assets: 1750000, liabilities: 920000, income: 620000, expenses: 380000 }
    ];

    // Tree View Component
    const TreeView = ({ accounts, level = 0 }) => {
        const rootAccounts = accounts.filter(acc => !acc.parentId || acc.parentId === '');

        const renderAccount = (account, depth = 0) => {
            const children = accounts.filter(acc => acc.parentId === account.id);
            const hasChildren = children.length > 0;
            const isExpanded = expandedGroups.has(account.id);
            const typeColor = getTypeColor(account.type);

            const getGroupBalance = (accountId) => {
                const childAccounts = accounts.filter(acc => acc.parentId === accountId);
                return childAccounts.reduce((sum, child) => {
                    if (child.isGroup) {
                        return sum + getGroupBalance(child.id);
                    }
                    return sum + child.balance;
                }, 0);
            };

            const displayBalance = account.isGroup ? getGroupBalance(account.id) : account.balance;
            const isDebitNormal = ['Asset', 'Expense'].includes(account.type);
            const balanceColor = displayBalance >= 0
                ? (isDebitNormal ? 'text-green-600' : 'text-blue-600')
                : 'text-red-600';

            return (
                <div key={account.id} className="relative">
                    <div
                        className={`
              flex items-center gap-3 p-3 rounded-lg mb-1 hover:bg-gray-50 dark:hover:bg-gray-800/50
              ${!account.isActive ? 'opacity-50' : ''}
              border-l-4
            `}
                        style={{
                            marginLeft: `${depth * 24}px`,
                            borderLeftColor: typeColor
                        }}
                    >
                        {account.isGroup && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                    const newExpanded = new Set(expandedGroups);
                                    if (newExpanded.has(account.id)) {
                                        newExpanded.delete(account.id);
                                    } else {
                                        newExpanded.add(account.id);
                                    }
                                    setExpandedGroups(newExpanded);
                                }}
                            >
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                        )}

                        {!account.isGroup && (
                            <div className="w-6 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: typeColor }} />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`font-medium truncate ${account.isGroup ? 'text-base' : 'text-sm'}`}>
                                    {account.name}
                                </h3>
                                <div className="flex gap-1 flex-wrap">
                                    {account.isGroup && (
                                        <Badge variant="outline" className="text-xs px-2 py-0">
                                            <FolderTree className="h-3 w-3 mr-1" />
                                            Group
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs px-2 py-0 font-mono">
                                        {account.code}
                                    </Badge>
                                    {!account.isActive && (
                                        <Badge variant="destructive" className="text-xs px-2 py-0">
                                            Inactive
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {account.description && (
                                <p className="text-sm text-muted-foreground truncate mt-1">
                                    {account.description}
                                </p>
                            )}
                        </div>

                        <div className="text-right min-w-[140px]">
                            <div className={`font-medium ${balanceColor}`}>
                                ₹{Math.abs(displayBalance).toLocaleString('en-IN')}
                                {displayBalance < 0 && ' CR'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {account.type}
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => router.push(`/erp/accounting/ledger?account=${account.code}`)}
                            >
                                <BarChart3 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {account.isGroup && isExpanded && hasChildren && (
                        <div className="mt-1">
                            {children.map(child => renderAccount(child, depth + 1))}
                        </div>
                    )}
                </div>
            );
        };

        return (
            <div className="space-y-2">
                {rootAccounts.map(account => renderAccount(account))}
            </div>
        );
    };

    // Load demo data function
    const loadDemoData = () => {
        const demoAccounts = [
            // Asset Accounts
            { id: '1', code: 'ACC-1000', name: 'Current Assets', type: 'Asset', category: 'Assets', balance: 2500000, isGroup: true, isActive: true, level: 0 },
            { id: '2', code: 'ACC-1100', name: 'Cash and Bank', type: 'Asset', category: 'Assets', balance: 1500000, isGroup: true, isActive: true, parentId: '1', level: 1 },
            { id: '3', code: 'ACC-1110', name: 'Cash in Hand', type: 'Asset', category: 'Assets', balance: 500000, isGroup: false, isActive: true, parentId: '2', level: 2 },
            { id: '4', code: 'ACC-1120', name: 'Bank Account', type: 'Asset', category: 'Assets', balance: 1000000, isGroup: false, isActive: true, parentId: '2', level: 2 },
            { id: '5', code: 'ACC-1200', name: 'Accounts Receivable', type: 'Asset', category: 'Assets', balance: 750000, isGroup: false, isActive: true, parentId: '1', level: 1 },
            { id: '6', code: 'ACC-1300', name: 'Inventory', type: 'Asset', category: 'Assets', balance: 250000, isGroup: false, isActive: true, parentId: '1', level: 1 },

            // Liability Accounts
            { id: '7', code: 'ACC-2000', name: 'Current Liabilities', type: 'Liability', category: 'Liabilities', balance: -1250000, isGroup: true, isActive: true, level: 0 },
            { id: '8', code: 'ACC-2100', name: 'Accounts Payable', type: 'Liability', category: 'Liabilities', balance: -800000, isGroup: false, isActive: true, parentId: '7', level: 1 },
            { id: '9', code: 'ACC-2200', name: 'Short-term Loans', type: 'Liability', category: 'Liabilities', balance: -450000, isGroup: false, isActive: true, parentId: '7', level: 1 },

            // Equity Accounts
            { id: '10', code: 'ACC-3000', name: 'Equity', type: 'Equity', category: 'Equity', balance: -1250000, isGroup: true, isActive: true, level: 0 },
            { id: '11', code: 'ACC-3100', name: 'Capital Stock', type: 'Equity', category: 'Equity', balance: -1000000, isGroup: false, isActive: true, parentId: '10', level: 1 },
            { id: '12', code: 'ACC-3200', name: 'Retained Earnings', type: 'Equity', category: 'Equity', balance: -250000, isGroup: false, isActive: true, parentId: '10', level: 1 },

            // Income Accounts
            { id: '13', code: 'ACC-4000', name: 'Revenue', type: 'Income', category: 'Revenue', balance: 2000000, isGroup: true, isActive: true, level: 0 },
            { id: '14', code: 'ACC-4100', name: 'Sales Revenue', type: 'Income', category: 'Revenue', balance: 1500000, isGroup: false, isActive: true, parentId: '13', level: 1 },
            { id: '15', code: 'ACC-4200', name: 'Service Revenue', type: 'Income', category: 'Revenue', balance: 500000, isGroup: false, isActive: true, parentId: '13', level: 1 },

            // Expense Accounts
            { id: '16', code: 'ACC-5000', name: 'Operating Expenses', type: 'Expense', category: 'Expenses', balance: 1200000, isGroup: true, isActive: true, level: 0 },
            { id: '17', code: 'ACC-5100', name: 'Salaries and Wages', type: 'Expense', category: 'Expenses', balance: 700000, isGroup: false, isActive: true, parentId: '16', level: 1 },
            { id: '18', code: 'ACC-5200', name: 'Rent Expense', type: 'Expense', category: 'Expenses', balance: 250000, isGroup: false, isActive: true, parentId: '16', level: 1 },
            { id: '19', code: 'ACC-5300', name: 'Utilities Expense', type: 'Expense', category: 'Expenses', balance: 100000, isGroup: false, isActive: true, parentId: '16', level: 1 },
            { id: '20', code: 'ACC-5400', name: 'Marketing Expense', type: 'Expense', category: 'Expenses', balance: 150000, isGroup: false, isActive: true, parentId: '16', level: 1 }
        ];

        setAccounts(demoAccounts);
    };

    if (loading) {
        return (
            <div className="p-8 space-y-6">
                <Skeleton className="h-12 w-full rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                    {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
                <Skeleton className="h-64 rounded-lg" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Advanced Chart of Accounts</h2>
                    <p className="text-muted-foreground">Manage accounting structure and financial hierarchy</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={loadAccounts}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={exportToCSV}>CSV Export</DropdownMenuItem>
                            <DropdownMenuItem onClick={exportToPDF}>PDF Report</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportReport('summary')}>Summary Report</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportReport('detailed')}>Detailed Report</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" onClick={() => router.push('/erp/accounting/chart-of-accounts/create')}>
                        <Plus className="mr-2 h-4 w-4" /> Add Account
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.accountCounts.total}</div>
                        <p className="text-xs text-muted-foreground">{summary.accountCounts.active} active</p>
                        <Progress value={(summary.accountCounts.active / summary.accountCounts.total) * 100} className="mt-2" />
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            ₹{summary.totalAssets.toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-muted-foreground">Current value</p>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            ₹{summary.totalLiabilities.toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-muted-foreground">Outstanding</p>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                            ₹{Math.abs(netWorth).toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-muted-foreground">{netWorth >= 0 ? 'Positive' : 'Negative'}</p>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                            ₹{Math.abs(netProfit).toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-muted-foreground">YTD</p>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Group Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-600">{summary.accountCounts.groups}</div>
                        <p className="text-xs text-muted-foreground">Hierarchy levels</p>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Ledger Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{summary.accountCounts.leaf}</div>
                        <p className="text-xs text-muted-foreground">Transactional</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center">
                            <Filter className="mr-2 h-4 w-4" /> Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Account Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Asset">Assets</SelectItem>
                                    <SelectItem value="Liability">Liabilities</SelectItem>
                                    <SelectItem value="Equity">Equity</SelectItem>
                                    <SelectItem value="Income">Income</SelectItem>
                                    <SelectItem value="Expense">Expenses</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="zero-balance">Show zero balance</Label>
                                <Switch
                                    id="zero-balance"
                                    checked={showZeroBalance}
                                    onCheckedChange={setShowZeroBalance}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center">
                            <Calculator className="mr-2 h-4 w-4" /> Balance Range
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Label className="text-sm">
                                ₹{balanceRange[0].toLocaleString('en-IN')} - ₹{balanceRange[1].toLocaleString('en-IN')}
                            </Label>
                            <Slider
                                defaultValue={[0, 1000000]}
                                max={1000000}
                                step={10000}
                                value={balanceRange}
                                onValueChange={setBalanceRange}
                                className="w-full"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center">
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Select value={viewMode} onValueChange={setViewMode}>
                                <SelectTrigger>
                                    <SelectValue placeholder="View Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="overview">Overview</SelectItem>
                                    <SelectItem value="accounts">Accounts List</SelectItem>
                                    <SelectItem value="hierarchy">Hierarchy View</SelectItem>
                                    <SelectItem value="analytics">Analytics</SelectItem>
                                    <SelectItem value="reports">Reports</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="inactive">Show inactive</Label>
                                <Switch
                                    id="inactive"
                                    checked={showInactive}
                                    onCheckedChange={setShowInactive}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs Section */}
            <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-4">
                <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="accounts">Accounts</TabsTrigger>
                    <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Quick Overview</CardTitle>
                                    <CardDescription>Key financial metrics and account summary</CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-[250px]">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search account..."
                                            className="pl-9"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Balance Sheet Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Balance Sheet Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Total Assets</span>
                                                <span className="font-medium text-blue-600">₹{summary.totalAssets.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Total Liabilities</span>
                                                <span className="font-medium text-red-600">₹{summary.totalLiabilities.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Total Equity</span>
                                                <span className="font-medium text-purple-600">₹{summary.totalEquity.toLocaleString('en-IN')}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between font-semibold">
                                                <span>Net Worth</span>
                                                <span className={`${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    ₹{Math.abs(netWorth).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Income Statement Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Income Statement Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Total Income</span>
                                                <span className="font-medium text-green-600">₹{summary.totalIncome.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Total Expenses</span>
                                                <span className="font-medium text-amber-600">₹{summary.totalExpenses.toLocaleString('en-IN')}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between font-semibold">
                                                <span>Net Profit</span>
                                                <span className={`${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    ₹{Math.abs(netProfit).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Accounts */}
                            <div className="mt-6">
                                <h3 className="font-semibold mb-4">Recent Accounts</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Balance</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAccounts.slice(0, 5).map((account) => (
                                                <TableRow key={account.id}>
                                                    <TableCell className="font-mono text-sm">{account.code}</TableCell>
                                                    <TableCell className="font-medium">{account.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs">
                                                            {account.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className={`font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        ₹{Math.abs(account.balance).toLocaleString('en-IN')}
                                                        {account.balance < 0 && ' CR'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={account.isActive ? "default" : "destructive"} className="text-xs">
                                                            {account.isActive ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Accounts Tab */}
                <TabsContent value="accounts">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Accounts Management</CardTitle>
                                    <CardDescription>Manage all ledger and group accounts</CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-[250px]">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search account..."
                                            className="pl-9"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="Asset">Assets</SelectItem>
                                            <SelectItem value="Liability">Liabilities</SelectItem>
                                            <SelectItem value="Equity">Equity</SelectItem>
                                            <SelectItem value="Income">Income</SelectItem>
                                            <SelectItem value="Expense">Expenses</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12"></TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Account Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Balance</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center py-8">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                                                        <p className="text-sm text-muted-foreground">Loading accounts data...</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : paginatedAccounts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center py-8">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                                        <p className="text-sm text-muted-foreground">No accounts found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedAccounts.map((account) => {
                                                const typeColor = getTypeColor(account.type);
                                                const isDebitNormal = ['Asset', 'Expense'].includes(account.type);
                                                const balanceColor = account.balance >= 0
                                                    ? (isDebitNormal ? 'text-green-600' : 'text-blue-600')
                                                    : 'text-red-600';

                                                return (
                                                    <TableRow key={account.id} className={!account.isActive ? 'opacity-50' : ''}>
                                                        <TableCell>
                                                            {account.isGroup ? (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                    onClick={() => {
                                                                        const newExpanded = new Set(expandedGroups);
                                                                        if (newExpanded.has(account.id)) {
                                                                            newExpanded.delete(account.id);
                                                                        } else {
                                                                            newExpanded.add(account.id);
                                                                        }
                                                                        setExpandedGroups(newExpanded);
                                                                    }}
                                                                >
                                                                    {expandedGroups.has(account.id) ? (
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    ) : (
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            ) : (
                                                                <div className="w-6 flex items-center justify-center">
                                                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: typeColor }} />
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="font-mono text-sm">
                                                            <Badge variant="outline" className="font-normal">
                                                                {account.code}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{account.name}</div>
                                                            {account.description && (
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {account.description}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs px-2 py-0.5"
                                                                style={{
                                                                    backgroundColor: typeColor + '10',
                                                                    borderColor: typeColor + '30',
                                                                    color: typeColor
                                                                }}
                                                            >
                                                                {account.type}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="text-xs">
                                                                {account.category || 'Uncategorized'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className={`font-medium ${balanceColor}`}>
                                                            ₹{Math.abs(account.balance).toLocaleString('en-IN')}
                                                            {account.balance < 0 && ' CR'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={account.isActive ? "default" : "destructive"} className="text-xs">
                                                                {account.isActive ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => router.push(`/erp/accounting/chart-of-accounts/${account.id}/edit`)}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit Account
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem>
                                                                        <BarChart3 className="mr-2 h-4 w-4" />
                                                                        View Ledger
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <Calculator className="mr-2 h-4 w-4" />
                                                                        Calculate Balance
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts
                                    </div>
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>

                                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                                let pageNum = i + 1;
                                                if (totalPages > 5 && currentPage > 3) {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                                if (pageNum > totalPages) return null;

                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            isActive={currentPage === pageNum}
                                                            className="cursor-pointer"
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}

                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Hierarchy Tab */}
                <TabsContent value="hierarchy">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Account Hierarchy</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const allGroups = accounts.filter(acc => acc.isGroup).map(acc => acc.id);
                                            setExpandedGroups(new Set(allGroups));
                                        }}
                                    >
                                        Expand All
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setExpandedGroups(new Set())}
                                    >
                                        Collapse All
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[600px]">
                                <TreeView accounts={filteredAccounts} />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Type Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={accountTypeChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {accountTypeChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value) => [`${value} accounts`, 'Count']} />
                                            <Legend />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsLineChart data={monthlyTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <RechartsTooltip
                                                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Balance']}
                                            />
                                            <Legend />
                                            <Line type="monotone" dataKey="assets" stroke="#3b82f6" strokeWidth={2} />
                                            <Line type="monotone" dataKey="liabilities" stroke="#ef4444" strokeWidth={2} />
                                            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                                            <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} />
                                        </RechartsLineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {analyticsData.map((data) => (
                            <Card key={data.type}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{data.type}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold" style={{ color: data.color }}>
                                        {data.count}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Total: ₹{data.totalBalance.toLocaleString('en-IN')}
                                    </p>
                                    <Progress
                                        value={(data.count / filteredAccounts.filter(a => !a.isGroup).length) * 100}
                                        className="mt-2"
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports">
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Reports</CardTitle>
                            <CardDescription>Generate and export financial reports</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Balance Sheet</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Assets, Liabilities, and Equity report
                                        </p>
                                        <Button className="w-full" onClick={() => exportReport('balance-sheet')}>
                                            Generate Report
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Income Statement</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Revenue and Expenses report
                                        </p>
                                        <Button className="w-full" onClick={() => exportReport('income-statement')}>
                                            Generate Report
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Account Ledger</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Detailed account transactions
                                        </p>
                                        <Button className="w-full" onClick={() => exportReport('ledger')}>
                                            Generate Report
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Configuration Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Configuration</CardTitle>
                    <CardDescription>Configure account settings and rules</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center">
                                <Settings className="mr-2 h-4 w-4" /> General Settings
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="auto-reconcile">Auto Reconcile</Label>
                                    <Switch id="auto-reconcile" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="allow-negative">Allow Negative Balance</Label>
                                    <Switch id="allow-negative" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="auto-close">Auto Close Period</Label>
                                    <Switch id="auto-close" defaultChecked />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Number Format</h3>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select defaultValue="inr">
                                        <SelectTrigger id="currency">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="inr">INR (₹)</SelectItem>
                                            <SelectItem value="usd">USD ($)</SelectItem>
                                            <SelectItem value="eur">EUR (€)</SelectItem>
                                            <SelectItem value="gbp">GBP (£)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="decimal-places">Decimal Places</Label>
                                    <Select defaultValue="2">
                                        <SelectTrigger id="decimal-places">
                                            <SelectValue placeholder="Select decimal places" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">0</SelectItem>
                                            <SelectItem value="2">2</SelectItem>
                                            <SelectItem value="3">3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center">
                                <Shield className="mr-2 h-4 w-4" /> Security Settings
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="audit-log">Audit Log</Label>
                                    <Switch id="audit-log" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="approval-required">Approval Required</Label>
                                    <Switch id="approval-required" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="backup-enabled">Auto Backup</Label>
                                    <Switch id="backup-enabled" defaultChecked />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}