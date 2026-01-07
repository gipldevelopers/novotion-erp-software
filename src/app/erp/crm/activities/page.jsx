// Updated: 2025-12-27
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { crmService } from '@/services/crmService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Phone, 
    Mail, 
    Users, 
    CheckSquare, 
    Calendar, 
    ArrowUpRight,
    Plus,
    Search,
    Filter,
    Clock,
    MessageSquare,
    FileText,
    Video,
    ShoppingCart,
    Target,
    TrendingUp,
    Download,
    MoreHorizontal,
    Eye,
    Edit,
    Trash,
    User,
    Building2,
    Bell,
    Activity as ActivityIcon
} from 'lucide-react';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { format, isToday, isYesterday, isThisWeek, differenceInMinutes } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ActivitiesPage() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const data = await crmService.getActivities();
            setActivities(data);
        } catch (error) {
            console.error('Failed to fetch activities', error);
            toast.error('Failed to load activities');
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const now = new Date();
        return {
            total: activities.length,
            today: activities.filter(a => isToday(new Date(a.date))).length,
            upcoming: activities.filter(a => new Date(a.date) > now && a.status !== 'Completed').length,
            overdue: activities.filter(a => new Date(a.date) < now && a.status !== 'Completed').length,
            completed: activities.filter(a => a.status === 'Completed').length,
            callCount: activities.filter(a => a.type === 'Call').length,
            meetingCount: activities.filter(a => a.type === 'Meeting').length,
        };
    }, [activities]);

    const getActivityConfig = (activity) => {
        const configs = {
            Call: {
                icon: Phone,
                bgColor: 'bg-blue-500/10',
                iconColor: 'text-blue-600',
                badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
                darkBadge: 'dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
            },
            Email: {
                icon: Mail,
                bgColor: 'bg-emerald-500/10',
                iconColor: 'text-emerald-600',
                badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                darkBadge: 'dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
            },
            Meeting: {
                icon: Users,
                bgColor: 'bg-purple-500/10',
                iconColor: 'text-purple-600',
                badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
                darkBadge: 'dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
            },
            Task: {
                icon: CheckSquare,
                bgColor: 'bg-amber-500/10',
                iconColor: 'text-amber-600',
                badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
                darkBadge: 'dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
            },
            FollowUp: {
                icon: Clock,
                bgColor: 'bg-orange-500/10',
                iconColor: 'text-orange-600',
                badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
                darkBadge: 'dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800'
            },
            Demo: {
                icon: Video,
                bgColor: 'bg-indigo-500/10',
                iconColor: 'text-indigo-600',
                badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                darkBadge: 'dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800'
            }
        };
        return configs[activity.type] || configs.Task;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': 
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'Scheduled': 
                return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300';
            case 'In Progress': 
                return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300';
            case 'Overdue': 
                return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300';
            default: 
                return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getTimeLabel = (date) => {
        const activityDate = new Date(date);
        const now = new Date();
        
        if (isToday(activityDate)) {
            const diffMinutes = differenceInMinutes(activityDate, now);
            if (diffMinutes < 0) {
                const hoursAgo = Math.abs(Math.floor(diffMinutes / 60));
                return hoursAgo === 0 ? 'Just now' : `${hoursAgo}h ago`;
            } else {
                return format(activityDate, 'h:mm a');
            }
        } else if (isYesterday(activityDate)) {
            return 'Yesterday';
        } else if (isThisWeek(activityDate)) {
            return format(activityDate, 'EEEE');
        } else {
            return format(activityDate, 'MMM d');
        }
    };

    const getDateGroup = (date) => {
        const activityDate = new Date(date);
        
        if (isToday(activityDate)) return 'Today';
        if (isYesterday(activityDate)) return 'Yesterday';
        if (isThisWeek(activityDate)) return 'This Week';
        
        return format(activityDate, 'MMMM yyyy');
    };

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             activity.relatedTo?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilter === 'all' || activity.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
        
        const activityDate = new Date(activity.date);
        const now = new Date();
        let matchesDate = true;
        
        switch (dateFilter) {
            case 'today': matchesDate = isToday(activityDate); break;
            case 'upcoming': matchesDate = activityDate > now; break;
            case 'past': matchesDate = activityDate < now; break;
            case 'week': matchesDate = isThisWeek(activityDate); break;
            default: matchesDate = true;
        }
        
        return matchesSearch && matchesType && matchesStatus && matchesDate;
    });

    const groupedActivities = useMemo(() => {
        const groups = {};
        filteredActivities.forEach(activity => {
            const group = getDateGroup(activity.date);
            if (!groups[group]) groups[group] = [];
            groups[group].push(activity);
        });
        return groups;
    }, [filteredActivities]);

    const handleMarkComplete = async (activityId) => {
        try {
            await crmService.updateActivity(activityId, { status: 'Completed' });
            toast.success('Activity marked as completed');
            fetchActivities();
        } catch (error) {
            console.error('Failed to update activity', error);
            toast.error('Failed to update activity');
        }
    };

    const handleDeleteActivity = async (activityId, activityName) => {
        if (!confirm(`Are you sure you want to delete "${activityName}"?`)) return;
        
        try {
            await crmService.deleteActivity(activityId);
            toast.success('Activity deleted');
            fetchActivities();
        } catch (error) {
            console.error('Failed to delete activity', error);
            toast.error('Failed to delete activity');
        }
    };

    return (
        <div className="space-y-6 p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Activity Timeline</h2>
                    <p className="text-muted-foreground">Track all interactions, tasks, and scheduled events</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Activity
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <ActivityIcon className="h-8 w-8 text-primary/30" />
                        </div>
                        <Progress value={(stats.completed / stats.total) * 100} className="h-1 mt-3" />
                        <p className="text-xs text-muted-foreground mt-2">{stats.completed} completed</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today</p>
                                <p className="text-2xl font-bold">{stats.today}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Scheduled activities</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                                <p className="text-2xl font-bold">{stats.upcoming}</p>
                            </div>
                            <Clock className="h-8 w-8 text-emerald-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Future events</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                                <p className="text-2xl font-bold">{stats.overdue}</p>
                            </div>
                            <Bell className="h-8 w-8 text-rose-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Calls</p>
                                <p className="text-2xl font-bold">{stats.callCount}</p>
                            </div>
                            <Phone className="h-8 w-8 text-blue-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Phone conversations</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Meetings</p>
                                <p className="text-2xl font-bold">{stats.meetingCount}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Scheduled meetings</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completion</p>
                                <p className="text-2xl font-bold">
                                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-emerald-500/30" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Success rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Tabs */}
            <Card className="border-none shadow-sm bg-transparent">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Activity Feed</CardTitle>
                            <CardDescription>
                                {filteredActivities.length} activity{filteredActivities.length !== 1 ? 's' : ''} found
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-1 sm:flex-initial sm:justify-end">
                            <div className="relative flex-1 sm:flex-initial sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search activities..."
                                    className="pl-9 bg-background"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Call">Call</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="Meeting">Meeting</SelectItem>
                                    <SelectItem value="Task">Task</SelectItem>
                                    <SelectItem value="FollowUp">Follow-up</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <Target className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Overdue">Overdue</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Dates</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="past">Past</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Activity Timeline */}
                    <div className="space-y-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
                                <p className="text-sm text-muted-foreground mt-3">Loading activities...</p>
                            </div>
                        ) : filteredActivities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ActivityIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                <h3 className="font-medium">No activities found</h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                    {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'Get started by creating your first activity'
                                    }
                                </p>
                            </div>
                        ) : (
                            Object.entries(groupedActivities).map(([group, groupActivities]) => (
                                <div key={group} className="space-y-4">
                                    {/* Date Group Header */}
                                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-px flex-1 bg-border" />
                                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                                {group}
                                            </h3>
                                            <div className="h-px flex-1 bg-border" />
                                        </div>
                                    </div>
                                    
                                    {/* Activities in Group */}
                                    <div className="space-y-3">
                                        {groupActivities.map((activity) => {
                                            const config = getActivityConfig(activity);
                                            const Icon = config.icon;
                                            const isOverdue = new Date(activity.date) < new Date() && activity.status !== 'Completed';
                                            
                                            return (
                                                <Card 
                                                    key={activity.id} 
                                                    className={cn(
                                                        "border-border/50 hover:shadow-md transition-all duration-200 group",
                                                        isOverdue && "border-rose-200 dark:border-rose-800/50"
                                                    )}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start gap-4">
                                                            {/* Icon */}
                                                            <div className={cn(
                                                                "flex-shrink-0 rounded-xl p-3",
                                                                config.bgColor
                                                            )}>
                                                                <Icon className={cn("h-5 w-5", config.iconColor)} />
                                                            </div>
                                                            
                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <h3 className="font-semibold text-lg">
                                                                            {activity.subject}
                                                                        </h3>
                                                                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                                                            {activity.description}
                                                                        </p>
                                                                    </div>
                                                                    
                                                                    <div className="flex items-center gap-2 ml-4">
                                                                        <Badge 
                                                                            variant="outline" 
                                                                            className={cn(
                                                                                "font-medium",
                                                                                config.badgeColor,
                                                                                config.darkBadge
                                                                            )}
                                                                        >
                                                                            {activity.type}
                                                                        </Badge>
                                                                        
                                                                        <Badge 
                                                                            variant="outline" 
                                                                            className={cn(
                                                                                getStatusColor(activity.status),
                                                                                isOverdue && "bg-rose-500/10 text-rose-600 border-rose-200 dark:bg-rose-900/30"
                                                                            )}
                                                                        >
                                                                            {isOverdue ? 'Overdue' : activity.status}
                                                                        </Badge>
                                                                        
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button 
                                                                                    variant="ghost" 
                                                                                    size="icon"
                                                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                >
                                                                                    <MoreHorizontal className="h-4 w-4" />
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
                                                                                    Edit Activity
                                                                                </DropdownMenuItem>
                                                                                {activity.status !== 'Completed' && (
                                                                                    <DropdownMenuItem onClick={() => handleMarkComplete(activity.id)}>
                                                                                        <CheckSquare className="mr-2 h-4 w-4" />
                                                                                        Mark Complete
                                                                                    </DropdownMenuItem>
                                                                                )}
                                                                                <DropdownMenuSeparator />
                                                                                <DropdownMenuItem 
                                                                                    onClick={() => handleDeleteActivity(activity.id, activity.subject)}
                                                                                    className="text-destructive focus:text-destructive"
                                                                                >
                                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                                    Delete
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Meta Information */}
                                                                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="h-4 w-4" />
                                                                        <span className="font-medium">
                                                                            {format(new Date(activity.date), 'MMM d, yyyy • h:mm a')}
                                                                        </span>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {getTimeLabel(activity.date)}
                                                                        </Badge>
                                                                    </div>
                                                                    
                                                                    <Separator orientation="vertical" className="h-4" />
                                                                    
                                                                    <div className="flex items-center gap-2">
                                                                        <User className="h-4 w-4" />
                                                                        <span>{activity.assignedTo || 'Unassigned'}</span>
                                                                    </div>
                                                                    
                                                                    <Separator orientation="vertical" className="h-4" />
                                                                    
                                                                    {activity.relatedTo && (
                                                                        <div className="flex items-center gap-2">
                                                                            <ArrowUpRight className="h-4 w-4" />
                                                                            <span>Related to: {activity.relatedTo}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                
                                                                {/* Tags & Priority */}
                                                                <div className="flex flex-wrap gap-2 mt-3">
                                                                    {activity.priority && (
                                                                        <Badge 
                                                                            variant="outline" 
                                                                            className={cn(
                                                                                activity.priority === 'High' && "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30",
                                                                                activity.priority === 'Medium' && "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30",
                                                                                activity.priority === 'Low' && "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30"
                                                                            )}
                                                                        >
                                                                            {activity.priority} Priority
                                                                        </Badge>
                                                                    )}
                                                                    
                                                                    {activity.customer && (
                                                                        <Badge variant="outline" className="bg-muted/50">
                                                                            <User className="mr-1 h-3 w-3" />
                                                                            {activity.customer}
                                                                        </Badge>
                                                                    )}
                                                                    
                                                                    {activity.duration && (
                                                                        <Badge variant="outline" className="bg-muted/50">
                                                                            <Clock className="mr-1 h-3 w-3" />
                                                                            {activity.duration}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
