'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    Filter,
    Download,
    MoreVertical,
    FileText,
    Calendar,
    DollarSign,
    Tag,
    User,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { expenseService } from '@/services/expenseService';
import { toast } from 'sonner';

export default function ExpensesPage() {
    const router = useRouter();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadExpenses();
    }, [statusFilter, searchQuery]);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const data = await expenseService.getExpenses({
                status: statusFilter,
                search: searchQuery
            });
            setExpenses(data);
        } catch (error) {
            console.error('Error loading expenses:', error);
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'rejected': return 'bg-red-100 text-red-700 hover:bg-red-100';
            case 'pending': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPaymentStatusIcon = (status) => {
        if (status === 'paid' || status === 'reimbursed') return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        return <Clock className="h-4 w-4 text-orange-500" />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const totalExpenses = expenses.reduce((sum, item) => sum + (item.totalAmount || item.amount), 0);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage business expenditures
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button onClick={() => router.push('/erp/accounting/expenses/create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Record Expense
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 space-y-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-900 border-blue-100">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-300">Total Expenses (Period)</span>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        ₹{totalExpenses.toLocaleString()}
                    </div>
                </Card>
                <Card className="p-6 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/erp/accounting/expenses/approvals')}>
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-300">Pending Approvals</span>
                    <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                        {expenses.filter(e => e.status === 'pending').length}
                    </div>
                </Card>
                <Card className="p-6 space-y-2">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-300">Unpaid / Reimbursable</span>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        ₹{expenses.filter(e => e.paymentStatus !== 'paid' && e.paymentStatus !== 'reimbursed').reduce((sum, e) => sum + (e.totalAmount || e.amount), 0).toLocaleString()}
                    </div>
                </Card>
            </div>

            <Card className="p-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search expenses..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="p-4 font-medium">Date & ID</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Submitted By</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Payment</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {expenses.length > 0 ? (
                                expenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium">{new Date(expense.date).toLocaleDateString()}</div>
                                            <div className="text-xs text-muted-foreground">{expense.id}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{expense.description}</span>
                                                {expense.attachment && <FileText className="h-3 w-3 text-muted-foreground" />}
                                            </div>
                                            {expense.vendorId && (
                                                <div className="text-xs text-muted-foreground">Vendor: {expense.vendorId}</div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline">{expense.category}</Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {expense.submittedBy?.charAt(0) || 'U'}
                                                </div>
                                                <span>{expense.submittedBy}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold">
                                            ₹{(expense.totalAmount || expense.amount).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <Badge className={getStatusBadge(expense.status)} variant="secondary">
                                                {expense.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 capitalize text-xs">
                                                {getPaymentStatusIcon(expense.paymentStatus)}
                                                <span>{expense.paymentStatus}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/erp/accounting/expenses/${expense.id}`)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                                        No expenses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
