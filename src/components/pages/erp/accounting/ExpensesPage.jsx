// Updated: 2025-12-27
import { useState } from 'react';
import { Plus, Download, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/erp/DataTable';
import { PermissionGuard } from '@/components/erp/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
const mockExpenses = [
    { id: '1', description: 'Office Rent - January', category: 'office', amount: 3500, status: 'approved', date: '2024-01-01', submittedBy: 'Admin' },
    { id: '2', description: 'Client Meeting Travel', category: 'travel', amount: 450, status: 'pending', date: '2024-01-05', submittedBy: 'John Doe' },
    { id: '3', description: 'Electricity Bill', category: 'utilities', amount: 850, status: 'approved', date: '2024-01-10', submittedBy: 'Admin' },
    { id: '4', description: 'Printer Supplies', category: 'supplies', amount: 120, status: 'approved', date: '2024-01-12', submittedBy: 'Jane Smith' },
    { id: '5', description: 'Team Lunch', category: 'other', amount: 280, status: 'rejected', date: '2024-01-15', submittedBy: 'Mike Wilson' },
    { id: '6', description: 'Software Subscription', category: 'office', amount: 199, status: 'approved', date: '2024-01-18', submittedBy: 'Admin' },
    { id: '7', description: 'Conference Tickets', category: 'travel', amount: 1200, status: 'pending', date: '2024-01-20', submittedBy: 'Sarah Brown' },
];
const categoryColors = {
    office: 'bg-primary/10 text-primary',
    travel: 'bg-info/10 text-info',
    utilities: 'bg-warning/10 text-warning',
    supplies: 'bg-success/10 text-success',
    salary: 'bg-chart-4/10 text-chart-4',
    other: 'bg-muted text-muted-foreground',
};
const statusColors = {
    approved: 'bg-success/10 text-success border-success/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};
export const ExpensesPage = () => {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const filteredExpenses = mockExpenses.filter((expense) => {
        const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
        return matchesCategory && matchesStatus;
    });
    const columns = [
        { key: 'description', header: 'Description' },
        {
            key: 'category',
            header: 'Category',
            render: (item) => (<Badge variant="secondary" className={categoryColors[item.category]}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </Badge>),
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (item) => (<span className="font-semibold">${item.amount.toLocaleString()}</span>),
        },
        {
            key: 'status',
            header: 'Status',
            render: (item) => (<Badge variant="outline" className={statusColors[item.status]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>),
        },
        { key: 'date', header: 'Date' },
        { key: 'submittedBy', header: 'Submitted By' },
        {
            key: 'actions',
            header: '',
            className: 'w-12',
            render: (item) => (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <PermissionGuard permission="expenses.edit">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2"/>
                Edit
              </DropdownMenuItem>
            </PermissionGuard>
            <PermissionGuard permission="expenses.delete">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2"/>
                Delete
              </DropdownMenuItem>
            </PermissionGuard>
          </DropdownMenuContent>
        </DropdownMenu>),
        },
    ];
    return (<div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Expenses</h1>
          <p className="page-description">Track and manage all expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2"/>
            Export
          </Button>
          <PermissionGuard permission="expenses.create">
            <Button>
              <Plus className="h-4 w-4 mr-2"/>
              Add Expense
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Filter className="h-4 w-4 text-muted-foreground"/>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="office">Office</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="supplies">Supplies</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredExpenses} columns={columns} searchable searchKeys={['description', 'submittedBy']}/>
    </div>);
};
