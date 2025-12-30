// Updated: 2025-12-27
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { crmService } from '@/services/crmService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
    Plus, 
    MoreHorizontal, 
    DollarSign, 
    Calendar, 
    TrendingUp, 
    Users, 
    Target,
    Filter,
    Search,
    Eye,
    Edit,
    User,
    Building2,
    Clock,
    Mail,
    Phone,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const STAGES = [
    { key: 'New', color: 'bg-blue-500', textColor: 'text-blue-700'},
    { key: 'Qualified', color: 'bg-purple-500', textColor: 'text-purple-700'},
    { key: 'Proposal', color: 'bg-amber-500', textColor: 'text-amber-700' },
    { key: 'Negotiation', color: 'bg-orange-500', textColor: 'text-orange-700'},
    { key: 'Closed Won', color: 'bg-emerald-500', textColor: 'text-emerald-700'},
    { key: 'Closed Lost', color: 'bg-red-500', textColor: 'text-red-700'}
];

const getStageConfig = (stage) => STAGES.find(s => s.key === stage) || STAGES[0];

export default function LeadsPage() {
    const router = useRouter();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedLead, setDraggedLead] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [userFilter, setUserFilter] = useState('all');
    const [valueFilter, setValueFilter] = useState('all');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const data = await crmService.getLeads();
            setLeads(data);
        } catch (error) {
            console.error('Failed to fetch leads', error);
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        return {
            total: leads.length,
            totalValue: leads.reduce((sum, lead) => sum + (lead.value || 0), 0),
            hotLeads: leads.filter(l => l.score > 70).length,
            todayAdded: leads.filter(l => {
                const today = new Date();
                const created = new Date(l.createdAt);
                return format(created, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
            }).length,
            pipelineValue: leads
                .filter(l => !['Closed Won', 'Closed Lost'].includes(l.stage))
                .reduce((sum, lead) => sum + (lead.value || 0) * ((lead.probability || 0) / 100), 0),
            conversionRate: leads.length > 0 
                ? (leads.filter(l => l.stage === 'Closed Won').length / leads.length * 100).toFixed(1)
                : 0
        };
    }, [leads]);

    const handleDragStart = (e, lead) => {
        setDraggedLead(lead);
        e.dataTransfer.setData('text/plain', lead.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, stage) => {
        e.preventDefault();
        if (!draggedLead) return;

        if (draggedLead.stage === stage) return;

        const stageConfig = getStageConfig(stage);
        
        // Optimistic update
        const updatedLeads = leads.map(l =>
            l.id === draggedLead.id ? { ...l, stage } : l
        );
        setLeads(updatedLeads);

        try {
            await crmService.updateLeadStage(draggedLead.id, stage);
            toast.success(`Lead moved to ${stage}`, {
                description: `${draggedLead.name} is now in ${stage}`,
                icon: stage === 'Closed Won' ? '🎉' : stage === 'Closed Lost' ? '📉' : '↔️'
            });
        } catch (error) {
            console.error('Failed to update lead stage', error);
            toast.error('Failed to save change');
            fetchLeads(); // Revert on error
        } finally {
            setDraggedLead(null);
        }
    };

    const getLeadsByStage = (stage) => {
        let filtered = leads.filter(lead => lead.stage === stage);
        
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(lead => 
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Apply user filter
        if (userFilter !== 'all') {
            filtered = filtered.filter(lead => lead.assignedTo === userFilter);
        }
        
        // Apply value filter
        if (valueFilter !== 'all') {
            if (valueFilter === 'high') filtered = filtered.filter(lead => (lead.value || 0) > 50000);
            if (valueFilter === 'medium') filtered = filtered.filter(lead => (lead.value || 0) > 10000 && (lead.value || 0) <= 50000);
            if (valueFilter === 'low') filtered = filtered.filter(lead => (lead.value || 0) <= 10000);
        }
        
        return filtered;
    };

    const getDaysInStage = (lead) => {
        const lastStageChange = lead.lastStageChange ? new Date(lead.lastStageChange) : new Date(lead.createdAt);
        return differenceInDays(new Date(), lastStageChange);
    };

    const getPriorityBadge = (lead) => {
        const daysInStage = getDaysInStage(lead);
        if (daysInStage > 14 && !['Closed Won', 'Closed Lost'].includes(lead.stage)) {
            return { label: 'Stalled', color: 'bg-red-100 text-red-700 border-red-200' };
        }
        if (lead.score > 70) {
            return { label: 'Hot', color: 'bg-orange-100 text-orange-700 border-orange-200' };
        }
        if (lead.probability > 70) {
            return { label: 'High', color: 'bg-blue-100 text-blue-700 border-blue-200' };
        }
        return null;
    };

    const getSourceIcon = (source) => {
        switch (source?.toLowerCase()) {
            case 'website': return '🌐';
            case 'referral': return '👥';
            case 'social': return '📱';
            case 'email': return '📧';
            case 'event': return '🎪';
            default: return '📞';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">Loading your sales pipeline...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] p-6 space-y-6">
            {/* Header with Stats */}
            <div className="flex flex-col gap-4 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Sales Pipeline</h2>
                        <p className="text-muted-foreground">Track and manage your leads through the sales funnel</p>
                    </div>
                    <Button onClick={() => router.push('/erp/crm/leads/create')} className="shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> New Lead
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <Users className="h-8 w-8 text-primary/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pipeline Value</p>
                                    <p className="text-2xl font-bold">₹{stats.pipelineValue.toLocaleString()}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-emerald-500/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Hot Leads</p>
                                    <p className="text-2xl font-bold">{stats.hotLeads}</p>
                                </div>
                                <Target className="h-8 w-8 text-orange-500/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Today's Leads</p>
                                    <p className="text-2xl font-bold">+{stats.todayAdded}</p>
                                </div>
                                <Clock className="h-8 w-8 text-blue-500/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                                    <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-500/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                                    <p className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-purple-500/30" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search leads by name, company, or email..."
                            className="pl-9 bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={userFilter} onValueChange={setUserFilter}>
                        <SelectTrigger className="w-[150px]">
                            <User className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Assigned to" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="John Doe">John Doe</SelectItem>
                            <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                            <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={valueFilter} onValueChange={setValueFilter}>
                        <SelectTrigger className="w-[140px]">
                            <DollarSign className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Lead Value" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Values</SelectItem>
                            <SelectItem value="high">High (&gt;₹50k)</SelectItem>
                            <SelectItem value="medium">Medium (₹10k-50k)</SelectItem>
                            <SelectItem value="low">Low (&lt;₹10k)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Badge variant="outline" className="bg-background">
                    {leads.filter(l => !['Closed Won', 'Closed Lost'].includes(l.stage)).length} Active Leads
                </Badge>
            </div>

            {/* Pipeline View */}
            <div className="flex-1 overflow-x-auto">
                <div className="flex h-full gap-4 min-w-[1400px] pb-6">
                    {STAGES.map((stageConfig) => {
                        const stageLeads = getLeadsByStage(stageConfig.key);
                        return (
                            <div
                                key={stageConfig.key}
                                className="flex-1 flex flex-col min-w-[300px] bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, stageConfig.key)}
                            >
                                <div className={cn(
                                    "p-4 border-b border-border/50 flex items-center justify-between font-semibold text-sm uppercase tracking-wide rounded-t-xl",
                                    stageConfig.bgColor
                                )}>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-2 w-2 rounded-full", stageConfig.color)} />
                                        <span className={stageConfig.textColor}>{stageConfig.key}</span>
                                    </div>
                                    <Badge variant="secondary" className={cn("ml-2", stageConfig.textColor)}>
                                        {stageLeads.length}
                                    </Badge>
                                </div>

                                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                                    {stageLeads.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-8 text-center">
                                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                                <Plus className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">No leads</p>
                                            <p className="text-xs text-muted-foreground mt-1">Drop leads here</p>
                                        </div>
                                    ) : (
                                        stageLeads.map((lead) => {
                                            const priority = getPriorityBadge(lead);
                                            const daysInStage = getDaysInStage(lead);
                                            
                                            return (
                                                <Card
                                                    key={lead.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, lead)}
                                                    className={cn(
                                                        "cursor-move hover:shadow-lg transition-all duration-200 border-border/50 group",
                                                        draggedLead?.id === lead.id && "opacity-50 scale-95"
                                                    )}
                                                >
                                                    <CardContent className="p-4 space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-start gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback className="text-xs">
                                                                        {lead.name.split(' ').map(n => n[0]).join('')}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div
                                                                        className="font-medium hover:text-primary cursor-pointer truncate max-w-[180px] group-hover:underline"
                                                                        onClick={() => router.push(`/erp/crm/leads/${lead.id}`)}
                                                                    >
                                                                        {lead.name}
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                                        <Building2 className="h-3 w-3" />
                                                                        <span className="truncate max-w-[150px]">{lead.company}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-6 w-6 p-0 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <MoreHorizontal className="h-3 w-3" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem onClick={() => router.push(`/erp/crm/leads/${lead.id}`)}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => toast.info('Editing lead...')}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit Lead
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <Mail className="mr-2 h-4 w-4" />
                                                                        Send Email
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    {STAGES.map(s => (
                                                                        s.key !== lead.stage && (
                                                                            <DropdownMenuItem 
                                                                                key={s.key} 
                                                                                onClick={() => handleDrop({ preventDefault: () => {} }, s.key)}
                                                                                className="flex items-center justify-between"
                                                                            >
                                                                                Move to {s.key}
                                                                                <ChevronRight className="h-3 w-3 ml-2" />
                                                                            </DropdownMenuItem>
                                                                        )
                                                                    ))}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                        
                                                        {lead.email && (
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <Mail className="h-3 w-3" />
                                                                <span className="truncate">{lead.email}</span>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                                                                <DollarSign className="h-3.5 w-3.5" />
                                                                ₹{lead.value?.toLocaleString() || '0'}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <Clock className="h-3 w-3" />
                                                                {daysInStage}d
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-1">
                                                            {priority && (
                                                                <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5", priority.color)}>
                                                                    {priority.label}
                                                                </Badge>
                                                            )}
                                                            {lead.source && (
                                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                                                    {getSourceIcon(lead.source)} {lead.source}
                                                                </Badge>
                                                            )}
                                                            {lead.score !== undefined && (
                                                                <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5",
                                                                    lead.score > 70 ? "bg-orange-50 text-orange-700 border-orange-200" :
                                                                    lead.score > 40 ? "bg-yellow-50 text-yellow-700 border-yellow-200" : 
                                                                    "bg-gray-50 text-gray-700 border-gray-200"
                                                                )}>
                                                                    Score: {lead.score}
                                                                </Badge>
                                                            )}
                                                            {lead.probability !== undefined && (
                                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-blue-50 text-blue-700 border-blue-200">
                                                                    {lead.probability}%
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="p-3 pt-0 text-xs text-muted-foreground flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-3 w-3" />
                                                            {format(new Date(lead.createdAt), 'MMM d')}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            <span className="truncate max-w-[80px]">{lead.assignedTo}</span>
                                                        </div>
                                                    </CardFooter>
                                                </Card>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Tips */}
            <div className="flex items-center justify-between text-xs text-muted-foreground shrink-0 pt-2 border-t">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span>Closed Won</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span>Active Pipeline</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                        <span>Stalls after 14 days</span>
                    </div>
                </div>
                <div className="text-xs">
                    Drag and drop to move leads between stages
                </div>
            </div>
        </div>
    );
}