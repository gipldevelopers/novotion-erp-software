'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    DollarSign,
    User,
    Calendar,
    Filter,
    Search,
    Eye,
    MoreVertical,
    Check,
    X,
    Inbox
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { expenseService } from '@/services/expenseService';
import { toast } from 'sonner';

export default function ExpenseApprovalsPage() {
    const router = useRouter();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const data = await expenseService.getExpenses();
            setExpenses(data);
        } catch (error) {
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await expenseService.approveExpense(id, 'Current User');
            toast.success('Expense approved successfully');
            setExpenses(expenses.map(e => e.id === id ? { ...e, status: 'approved' } : e));
        } catch (error) {
            toast.error('Failed to approve expense');
        }
    };

    const handleReject = async (id) => {
        try {
            await expenseService.rejectExpense(id, 'Rejected by User');
            toast.error('Expense rejected');
            setExpenses(expenses.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
        } catch (error) {
            toast.error('Failed to reject expense');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'rejected': return 'bg-red-100 text-red-700 hover:bg-red-100';
            case 'pending': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const pendingExpenses = expenses.filter(e => e.status === 'pending');
    const historyExpenses = expenses.filter(e => e.status !== 'pending');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expense Approvals</h1>
                    <p className="text-muted-foreground mt-1">
                        Review and approve expense claims from employees
                    </p>
                </div>
            </div>

            <Tabs defaultValue="pending" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="pending">
                        Pending
                        {pendingExpenses.length > 0 && (
                            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                                {pendingExpenses.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    {pendingExpenses.length === 0 ? (
                        <Card className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground bg-muted/20 border-dashed">
                            <Inbox className="h-12 w-12 mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold text-foreground">All Clear!</h3>
                            <p>No pending expenses to review.</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {pendingExpenses.map(expense => (
                                <ExpenseCard
                                    key={expense.id}
                                    expense={expense}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                    getStatusColor={getStatusColor}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {historyExpenses.map(expense => (
                            <ExpenseCard
                                key={expense.id}
                                expense={expense}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                getStatusColor={getStatusColor}
                                readOnly
                            />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ExpenseCard({ expense, onApprove, onReject, getStatusColor, readOnly }) {
    return (
        <Card className="p-4 transition-all hover:bg-muted/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {(expense.submittedBy || 'U').charAt(0)}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base">{expense.description}</h4>
                            <Badge className={getStatusColor(expense.status)} variant="secondary">
                                {expense.status}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" /> {expense.submittedBy || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" /> {expense.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" /> {new Date(expense.date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                        <div className="text-xl font-bold">₹{expense.totalAmount?.toLocaleString() || expense.amount?.toLocaleString()}</div>
                        {expense.gstAmount > 0 && (
                            <div className="text-xs text-muted-foreground">Incl. ₹{expense.gstAmount} GST</div>
                        )}
                    </div>

                    {!readOnly && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => onReject(expense.id)}
                            >
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => onApprove(expense.id)}
                            >
                                Approve
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
