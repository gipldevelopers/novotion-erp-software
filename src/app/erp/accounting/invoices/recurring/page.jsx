'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Calendar, MoreVertical, Play, Pause, Edit, Trash2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { accountingService } from '@/services/accountingService';

export default function RecurringInvoicesPage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            setLoading(true);
            const data = await accountingService.getRecurringInvoices();
            setInvoices(data);
        } catch (error) {
            console.error('Error loading recurring invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredInvoices = () => {
        let filtered = invoices;

        if (filterStatus !== 'all') {
            filtered = filtered.filter(inv => inv.status === filterStatus);
        }

        if (searchQuery) {
            filtered = filtered.filter(inv =>
                inv.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.customer.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        await accountingService.updateRecurringInvoice(id, { status: newStatus });
        loadInvoices();
    };

    const getFrequencyBadge = (frequency) => {
        const colors = {
            monthly: 'bg-blue-100 text-blue-700',
            quarterly: 'bg-purple-100 text-purple-700',
            yearly: 'bg-green-100 text-green-700',
        };
        return colors[frequency] || 'bg-gray-100 text-gray-700';
    };

    const getStatusBadge = (status) => {
        return status === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const filteredInvoices = getFilteredInvoices();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading recurring invoices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Recurring Invoices</h1>
                    <p className="text-muted-foreground mt-1">
                        Automate your regular billing with recurring invoice templates
                    </p>
                </div>
                <Button onClick={() => router.push('/erp/accounting/invoices/recurring/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Total Templates</div>
                    <div className="text-2xl font-bold">{invoices.length}</div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Active</div>
                    <div className="text-2xl font-bold text-green-600">
                        {invoices.filter(i => i.status === 'active').length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Paused</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {invoices.filter(i => i.status === 'paused').length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                    <div className="text-2xl font-bold text-blue-600">
                        ₹{invoices
                            .filter(i => i.status === 'active' && i.frequency === 'monthly')
                            .reduce((sum, i) => sum + i.amount, 0)
                            .toLocaleString('en-IN')}
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={filterStatus === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={filterStatus === 'active' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus('active')}
                        >
                            Active
                        </Button>
                        <Button
                            variant={filterStatus === 'paused' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus('paused')}
                        >
                            Paused
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Invoice List */}
            <div className="grid gap-4">
                {filteredInvoices.map((invoice) => (
                    <Card key={invoice.id} className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold">{invoice.templateName}</h3>
                                    <Badge className={getStatusBadge(invoice.status)}>
                                        {invoice.status}
                                    </Badge>
                                    <Badge className={getFrequencyBadge(invoice.frequency)}>
                                        {invoice.frequency}
                                    </Badge>
                                    {invoice.autoSend && (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            Auto-send
                                        </Badge>
                                    )}
                                </div>

                                <div className="text-sm text-muted-foreground space-y-1">
                                    <div>Customer: {invoice.customer}</div>
                                    <div>Email: {invoice.email}</div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Next: {formatDate(invoice.nextGenerationDate)}
                                        </span>
                                        <span>Last: {formatDate(invoice.lastGeneratedDate)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-2xl font-bold">
                                        ₹{invoice.amount.toLocaleString('en-IN')}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        per {invoice.frequency === 'monthly' ? 'month' : invoice.frequency === 'quarterly' ? 'quarter' : 'year'}
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => router.push(`/erp/accounting/invoices/recurring/${invoice.id}`)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Template
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toggleStatus(invoice.id, invoice.status)}>
                                            {invoice.status === 'active' ? (
                                                <>
                                                    <Pause className="h-4 w-4 mr-2" />
                                                    Pause
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="h-4 w-4 mr-2" />
                                                    Activate
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Items Preview */}
                        <div className="mt-4 pt-4 border-t">
                            <div className="text-sm font-medium mb-2">Items:</div>
                            <div className="space-y-1">
                                {invoice.items.map((item, idx) => (
                                    <div key={idx} className="text-sm text-muted-foreground flex justify-between">
                                        <span>{item.name} (Qty: {item.quantity})</span>
                                        <span>₹{item.amount.toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredInvoices.length === 0 && (
                    <Card className="p-12 text-center">
                        <div className="text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No recurring invoices found</p>
                            <p className="text-sm mt-2">Create your first recurring invoice template to automate billing</p>
                            <Button className="mt-4" onClick={() => router.push('/erp/accounting/invoices/recurring/create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Template
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
