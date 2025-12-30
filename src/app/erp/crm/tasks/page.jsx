// Updated: 2025-12-27
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { crmService } from '@/services/crmService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    CheckCircle2, 
    Circle, 
    Clock, 
    Plus, 
    Filter, 
    Search, 
    User, 
    Calendar,
    Flag,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Download,
    TrendingUp,
    Target,
    CheckSquare,
    AlertCircle,
    ChevronDown,
    Star,
    Users,
    FileText,
    ArrowUpRight,
    SortAsc
} from 'lucide-react';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, isThisWeek, differenceInDays } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [assigneeFilter, setAssigneeFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'board' | 'calendar'
    const [sortBy, setSortBy] = useState('dueDate');
    const [editingTask, setEditingTask] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        assignedTo: '',
        status: 'Not Started'
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await crmService.getTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const now = new Date();
        return {
            total: tasks.length,
            completed: tasks.filter(t => t.status === 'Completed').length,
            overdue: tasks.filter(t => new Date(t.dueDate) < now && t.status !== 'Completed').length,
            dueToday: tasks.filter(t => isToday(new Date(t.dueDate)) && t.status !== 'Completed').length,
            dueThisWeek: tasks.filter(t => isThisWeek(new Date(t.dueDate)) && t.status !== 'Completed').length,
            highPriority: tasks.filter(t => t.priority === 'High').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0,
        };
    }, [tasks]);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300';
            case 'Medium': return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300';
            case 'Low': return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'In Progress': return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Not Started': return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getDueDateLabel = (dueDate) => {
        const date = new Date(dueDate);
        const now = new Date();
        const diffDays = differenceInDays(date, now);
        
        if (isToday(date)) return { label: 'Today', color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' };
        if (isTomorrow(date)) return { label: 'Tomorrow', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' };
        if (diffDays < 0) return { label: 'Overdue', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' };
        if (diffDays <= 7) return { label: 'This week', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' };
        return { label: format(date, 'MMM d'), color: 'text-gray-600 bg-gray-100 dark:bg-gray-800' };
    };

    const filteredTasks = useMemo(() => {
        let filtered = [...tasks];
        
        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Apply filters
        if (statusFilter !== 'all') {
            filtered = filtered.filter(task => task.status === statusFilter);
        }
        
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }
        
        if (assigneeFilter !== 'all') {
            filtered = filtered.filter(task => task.assignedTo === assigneeFilter);
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'created':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });
        
        return filtered;
    }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter, sortBy]);

    const handleToggleStatus = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'Completed' ? 'Not Started' : 'Completed';
        
        try {
            await crmService.updateTask(taskId, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`);
            fetchTasks();
        } catch (error) {
            console.error('Failed to update task', error);
            toast.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId, taskTitle) => {
        if (!confirm(`Are you sure you want to delete "${taskTitle}"?`)) return;
        
        try {
            await crmService.deleteTask(taskId);
            toast.success('Task deleted');
            fetchTasks();
        } catch (error) {
            console.error('Failed to delete task', error);
            toast.error('Failed to delete task');
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.title.trim()) {
            toast.error('Task title is required');
            return;
        }
        
        try {
            await crmService.createTask(newTask);
            toast.success('Task created successfully');
            setNewTask({
                title: '',
                description: '',
                dueDate: '',
                priority: 'Medium',
                assignedTo: '',
                status: 'Not Started'
            });
            fetchTasks();
        } catch (error) {
            console.error('Failed to create task', error);
            toast.error('Failed to create task');
        }
    };

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Task Management</h2>
                    <p className="text-muted-foreground">Track, prioritize, and manage your team's tasks</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button onClick={() => toast.info('Quick task creation coming soon')}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <CheckSquare className="h-8 w-8 text-primary/30" />
                        </div>
                        <Progress value={stats.completionRate} className="h-1.5 mt-3" />
                        <p className="text-xs text-muted-foreground mt-2">{stats.completed} completed</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                                <p className="text-2xl font-bold">{stats.overdue}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-rose-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Due Today</p>
                                <p className="text-2xl font-bold">{stats.dueToday}</p>
                            </div>
                            <Clock className="h-8 w-8 text-amber-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Need completion</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                                <p className="text-2xl font-bold">{stats.highPriority}</p>
                            </div>
                            <Flag className="h-8 w-8 text-rose-600/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Critical tasks</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Controls */}
            <Card className="border-none shadow-sm bg-transparent">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Task Directory</CardTitle>
                            <CardDescription>
                                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-1 sm:flex-initial sm:justify-end">
                            <div className="relative flex-1 sm:flex-initial sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search tasks..."
                                    className="pl-9 bg-background"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Not Started">Not Started</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <Flag className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[140px]">
                                    <SortAsc className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dueDate">Due Date</SelectItem>
                                    <SelectItem value="priority">Priority</SelectItem>
                                    <SelectItem value="created">Recently Added</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Quick Create Task */}
                    <Card className="mb-6 border-dashed">
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                    >
                                        <Circle className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        placeholder="Add a new task..."
                                        className="flex-1"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                    />
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setNewTask({...newTask, dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')})}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Tomorrow
                                    </Button>
                                    <Button onClick={handleCreateTask}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-3 pl-11">
                                    <Select 
                                        value={newTask.priority} 
                                        onValueChange={(value) => setNewTask({...newTask, priority: value})}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <Flag className="mr-2 h-3 w-3" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="date"
                                        className="w-[140px]"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                                    />
                                    <Input
                                        placeholder="Assign to..."
                                        className="w-[140px]"
                                        value={newTask.assignedTo}
                                        onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tasks List */}
                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
                                <p className="text-sm text-muted-foreground mt-3">Loading tasks...</p>
                            </div>
                        ) : filteredTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CheckSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                <h3 className="font-medium">No tasks found</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'Get started by creating your first task'
                                    }
                                </p>
                            </div>
                        ) : (
                            filteredTasks.map((task) => {
                                const dueDateLabel = getDueDateLabel(task.dueDate);
                                const isOverdue = differenceInDays(new Date(task.dueDate), new Date()) < 0 && task.status !== 'Completed';
                                
                                return (
                                    <Card 
                                        key={task.id} 
                                        className={cn(
                                            "hover:shadow-md transition-all duration-200 border-border/50 group",
                                            isOverdue && "border-rose-200 dark:border-rose-800/50",
                                            task.status === 'Completed' && "opacity-80"
                                        )}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 mt-0.5"
                                                        onClick={() => handleToggleStatus(task.id, task.status)}
                                                    >
                                                        {task.status === 'Completed' ? (
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                        ) : (
                                                            <Circle className="h-5 w-5 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className={cn(
                                                                "font-medium text-base",
                                                                task.status === 'Completed' && "line-through text-muted-foreground"
                                                            )}>
                                                                {task.title}
                                                            </h4>
                                                            <Badge 
                                                                variant="outline" 
                                                                className={cn(
                                                                    "font-medium text-xs",
                                                                    getPriorityColor(task.priority)
                                                                )}
                                                            >
                                                                <Flag className="mr-1 h-3 w-3" />
                                                                {task.priority}
                                                            </Badge>
                                                            <Badge 
                                                                variant="outline" 
                                                                className={cn(
                                                                    "font-medium text-xs",
                                                                    getStatusColor(task.status)
                                                                )}
                                                            >
                                                                {task.status}
                                                            </Badge>
                                                            <Badge 
                                                                variant="outline" 
                                                                className={cn(
                                                                    "font-medium text-xs",
                                                                    dueDateLabel.color
                                                                )}
                                                            >
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                {dueDateLabel.label}
                                                            </Badge>
                                                        </div>
                                                        
                                                        {task.description && (
                                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                        
                                                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <User className="h-3 w-3" />
                                                                <span>{task.assignedTo || 'Unassigned'}</span>
                                                            </div>
                                                            <Separator orientation="vertical" className="h-4" />
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                                                            </div>
                                                            {task.createdAt && (
                                                                <>
                                                                    <Separator orientation="vertical" className="h-4" />
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>Created: {format(new Date(task.createdAt), 'MMM d')}</span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon"
                                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Task
                                                        </DropdownMenuItem>
                                                        {task.status !== 'Completed' && (
                                                            <DropdownMenuItem onClick={() => handleToggleStatus(task.id, task.status)}>
                                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                Mark Complete
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDeleteTask(task.id, task.title)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Task
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Completion Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Overall Progress</span>
                                    <span className="font-semibold">{stats.completionRate}%</span>
                                </div>
                                <Progress value={stats.completionRate} className="h-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 rounded-lg border">
                                    <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
                                    <div className="text-sm text-muted-foreground">Completed</div>
                                </div>
                                <div className="text-center p-3 rounded-lg border">
                                    <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                                    <div className="text-sm text-muted-foreground">In Progress</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {tasks
                                .filter(t => t.status !== 'Completed' && differenceInDays(new Date(t.dueDate), new Date()) <= 7)
                                .slice(0, 3)
                                .map(task => (
                                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                                        <div>
                                            <p className="font-medium">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">Due {getDueDateLabel(task.dueDate).label}</p>
                                        </div>
                                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                ))
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}