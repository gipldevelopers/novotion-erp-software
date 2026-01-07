'use client';

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    FunnelChart,
    Funnel,
    LabelList
} from 'recharts';
import {
    Plus,
    MoreHorizontal,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Target,
    Briefcase,
    Calendar,
    User,
    Clock,
    CheckCircle2,
    XCircle,
    LayoutGrid,
    List as ListIcon,
    TrendingUp,
    PieChart as PieChartIcon,
    Edit,
    Trash2,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Theme Colors
const THEME_COLORS = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    gray: '#64748b'
};

// Mock Data
const DEAL_STAGES = [
    { id: 'qualification', name: 'Qualification', color: 'bg-blue-100 text-blue-700 border-blue-200', badgeColor: 'bg-blue-500' },
    { id: 'needs_analysis', name: 'Needs Analysis', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', badgeColor: 'bg-indigo-500' },
    { id: 'proposal', name: 'Proposal', color: 'bg-purple-100 text-purple-700 border-purple-200', badgeColor: 'bg-purple-500' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-amber-100 text-amber-700 border-amber-200', badgeColor: 'bg-amber-500' },
    { id: 'closed_won', name: 'Closed Won', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', badgeColor: 'bg-emerald-500' },
];

const INITIAL_DEALS = [
    {
        id: '1',
        title: 'Enterprise License Renewal',
        company: 'Acme Corp',
        value: 125000,
        stage: 'negotiation',
        probability: 80,
        owner: 'Sarah Miller',
        expectedClose: '2024-02-15',
        type: 'Existing Business'
    },
    {
        id: '2',
        title: 'New Cloud Migration',
        company: 'TechFlow Inc',
        value: 85000,
        stage: 'proposal',
        probability: 60,
        owner: 'Mike Chen',
        expectedClose: '2024-03-01',
        type: 'New Business'
    },
    {
        id: '3',
        title: 'Q1 Service Contract',
        company: 'Global Logistics',
        value: 45000,
        stage: 'qualification',
        probability: 20,
        owner: 'Alex Johnson',
        expectedClose: '2024-04-10',
        type: 'New Business'
    },
    {
        id: '4',
        title: 'Consulting Project',
        company: 'Innovate Ltd',
        value: 32000,
        stage: 'needs_analysis',
        probability: 40,
        owner: 'Emma Davis',
        expectedClose: '2024-02-28',
        type: 'New Business'
    },
    {
        id: '5',
        title: 'Dedicated Support Plan',
        company: 'Swift Systems',
        value: 15000,
        stage: 'closed_won',
        probability: 100,
        owner: 'Sarah Miller',
        expectedClose: '2024-01-20',
        type: 'Existing Business'
    },
    {
        id: '6',
        title: 'Hardware Upgrade',
        company: 'Nexus Group',
        value: 220000,
        stage: 'negotiation',
        probability: 75,
        owner: 'Mike Chen',
        expectedClose: '2024-02-10',
        type: 'Existing Business'
    }
];

const FUNNEL_DATA = [
    { value: 100, name: 'Qualification', fill: THEME_COLORS.info },
    { value: 75, name: 'Needs Analysis', fill: THEME_COLORS.primary },
    { value: 50, name: 'Proposal', fill: THEME_COLORS.secondary },
    { value: 25, name: 'Negotiation', fill: THEME_COLORS.warning },
    { value: 15, name: 'Closed Won', fill: THEME_COLORS.success },
];

const FORECAST_DATA = [
    { month: 'Jan', exact: 120000, weighted: 105000 },
    { month: 'Feb', exact: 280000, weighted: 210000 },
    { month: 'Mar', exact: 150000, weighted: 90000 },
    { month: 'Apr', exact: 320000, weighted: 180000 },
    { month: 'May', exact: 250000, weighted: 125000 },
    { month: 'Jun', exact: 400000, weighted: 200000 },
];

export default function OpportunitiesPage() {
    const [viewMode, setViewMode] = useState('kanban'); // kanban | list | forecast
    const [deals, setDeals] = useState(INITIAL_DEALS);
    const [searchTerm, setSearchTerm] = useState('');
    const [draggedDeal, setDraggedDeal] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        value: '',
        stage: 'qualification',
        probability: 20,
        owner: 'Sarah Miller', // Default owner
        expectedClose: new Date().toISOString().split('T')[0],
        type: 'New Business'
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            company: '',
            value: '',
            stage: 'qualification',
            probability: 20,
            owner: 'Sarah Miller',
            expectedClose: new Date().toISOString().split('T')[0],
            type: 'New Business'
        });
        setEditingDeal(null);
    };

    const handleOpenDialog = (deal = null) => {
        if (deal) {
            setEditingDeal(deal);
            setFormData({
                title: deal.title,
                company: deal.company,
                value: deal.value,
                stage: deal.stage,
                probability: deal.probability,
                owner: deal.owner,
                expectedClose: deal.expectedClose,
                type: deal.type
            });
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSaveDeal = () => {
        if (!formData.title || !formData.company || !formData.value) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (editingDeal) {
            // Update existing deal
            const updatedDeals = deals.map(d => d.id === editingDeal.id ? { ...d, ...formData, value: Number(formData.value) } : d);
            setDeals(updatedDeals);
            toast.success("Deal updated successfully");
        } else {
            // Create new deal
            const newDeal = {
                id: Math.random().toString(36).substr(2, 9),
                ...formData,
                value: Number(formData.value)
            };
            setDeals([...deals, newDeal]);
            toast.success("New deal created successfully");
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const handleDeleteDeal = (id) => {
        if (confirm("Are you sure you want to delete this deal?")) {
            setDeals(deals.filter(d => d.id !== id));
            toast.success("Deal deleted successfully");
        }
    };

    // Drag and Drop Logic
    const handleDragStart = (e, deal) => {
        setDraggedDeal(deal);
        e.dataTransfer.setData('text/plain', deal.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, stageId) => {
        e.preventDefault();
        if (!draggedDeal) return;

        if (draggedDeal.stage !== stageId) {
            const updatedDeals = deals.map(d =>
                d.id === draggedDeal.id ? { ...d, stage: stageId } : d
            );
            setDeals(updatedDeals);
            toast.success(`Moved to ${DEAL_STAGES.find(s => s.id === stageId)?.name}`);
        }
        setDraggedDeal(null);
    };


    // Calculations for Stats
    const totalPipelineValue = deals.reduce((acc, deal) => acc + deal.value, 0);
    const weightedPipelineValue = deals.reduce((acc, deal) => acc + (deal.value * (deal.probability / 100)), 0);
    const totalDeals = deals.length;
    const avgDealSize = totalDeals > 0 ? totalPipelineValue / totalDeals : 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStageDeals = (stageId) => {
        return deals.filter(deal =>
            deal.stage === stageId &&
            (deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                deal.company.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const getStageTotal = (stageId) => {
        return getStageDeals(stageId).reduce((acc, deal) => acc + deal.value, 0);
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4 p-6 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-none">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Opportunity Pipeline</h1>
                    <p className="text-muted-foreground">Manage your deals, forecast revenue, and track sales performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
                        <TabsList>
                            <TabsTrigger value="kanban"><LayoutGrid className="w-4 h-4 mr-2" />Board</TabsTrigger>
                            <TabsTrigger value="list"><ListIcon className="w-4 h-4 mr-2" />List</TabsTrigger>
                            <TabsTrigger value="forecast"><TrendingUp className="w-4 h-4 mr-2" />Forecast</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => handleOpenDialog()}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Opportunity
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingDeal ? 'Edit Opportunity' : 'New Opportunity'}</DialogTitle>
                                <DialogDescription>
                                    {editingDeal ? 'Update deal details.' : 'Create a new sales opportunity.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Title</Label>
                                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="company" className="text-right">Company</Label>
                                    <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="value" className="text-right">Value</Label>
                                    <Input id="value" type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="stage" className="text-right">Stage</Label>
                                    <Select value={formData.stage} onValueChange={(val) => setFormData({ ...formData, stage: val })}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select stage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DEAL_STAGES.map(stage => (
                                                <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="probability" className="text-right">Probability</Label>
                                    <div className="col-span-3 flex items-center gap-2">
                                        <Input id="probability" type="number" max="100" value={formData.probability} onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })} className="w-20" />
                                        <span className="text-sm text-muted-foreground">%</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="owner" className="text-right">Owner</Label>
                                    <Select value={formData.owner} onValueChange={(val) => setFormData({ ...formData, owner: val })}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select owner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sarah Miller">Sarah Miller</SelectItem>
                                            <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                                            <SelectItem value="Alex Johnson">Alex Johnson</SelectItem>
                                            <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="date" className="text-right">Exp. Date</Label>
                                    <Input id="date" type="date" value={formData.expectedClose} onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveDeal}>Save Deal</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-none">
                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-100 dark:border-blue-900">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Pipeline</p>
                                <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalPipelineValue)}</h3>
                            </div>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <span className="text-emerald-600 flex items-center mr-1"><ArrowUpRight className="w-3 h-3 mr-1" /> +12%</span> vs last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background border-purple-100 dark:border-purple-900">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Weighted Forecast</p>
                                <h3 className="text-2xl font-bold mt-1">{formatCurrency(weightedPipelineValue)}</h3>
                            </div>
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <span className="text-emerald-600 flex items-center mr-1"><ArrowUpRight className="w-3 h-3 mr-1" /> +5%</span> vs last month
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Deal Size</p>
                                <h3 className="text-2xl font-bold mt-1">{formatCurrency(avgDealSize)}</h3>
                            </div>
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <PieChartIcon className="w-5 h-5 text-secondary-foreground" />
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            {totalDeals} active opportunities
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                                <h3 className="text-2xl font-bold mt-1">32%</h3>
                            </div>
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <Progress value={32} className="h-2 mt-3" />
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-none py-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search deals..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                        <User className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Owner" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Owners</SelectItem>
                        <SelectItem value="sarah">Sarah Miller</SelectItem>
                        <SelectItem value="mike">Mike Chen</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue="this_quarter">
                    <SelectTrigger className="w-[150px]">
                        <Calendar className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Close Date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="this_month">This Month</SelectItem>
                        <SelectItem value="this_quarter">This Quarter</SelectItem>
                        <SelectItem value="this_year">This Year</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                </Button>
            </div>

            {/* View Content */}
            <div className="flex-1 min-h-0">
                {viewMode === 'kanban' && (
                    <div className="h-full overflow-x-auto">
                        <div className="flex h-full gap-4 min-w-[1200px] pr-4">
                            {DEAL_STAGES.map((stage) => {
                                const stageDeals = getStageDeals(stage.id);
                                const stageTotal = getStageTotal(stage.id);
                                return (
                                    <div
                                        key={stage.id}
                                        className="flex-1 flex flex-col min-w-[280px] bg-muted/30 rounded-lg border border-border/50 h-full drop-target"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, stage.id)}
                                    >
                                        {/* Stage Header */}
                                        <div className={cn("p-3 border-b border-border/50 rounded-t-lg bg-background", stage.color)}>
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-semibold text-sm uppercase tracking-wider">{stage.name}</h3>
                                                <Badge variant="secondary" className="bg-white/50 text-inherit hover:bg-white/60">
                                                    {stageDeals.length}
                                                </Badge>
                                            </div>
                                            <div className="text-xs font-medium opacity-80">
                                                Expected: {formatCurrency(stageTotal)}
                                            </div>
                                        </div>

                                        {/* Stage Cards */}
                                        <ScrollArea className="flex-1 p-2">
                                            <div className="space-y-3">
                                                {stageDeals.map((deal) => (
                                                    <Card
                                                        key={deal.id}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, deal)}
                                                        className={cn(
                                                            "cursor-grab hover:shadow-md transition-all active:cursor-grabbing hover:border-primary/50",
                                                            draggedDeal?.id === deal.id ? "opacity-50 ring-2 ring-primary" : ""
                                                        )}
                                                    >
                                                        <CardContent className="p-3 space-y-3">
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                                    {deal.type}
                                                                </span>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-6 w-6 p-0">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => handleOpenDialog(deal)}>
                                                                            <Edit className="w-4 h-4 mr-2" />
                                                                            Edit Deal
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDeal(deal.id)}>
                                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>

                                                            <div onClick={() => handleOpenDialog(deal)}>
                                                                <h4 className="font-semibold text-sm leading-tight hover:text-primary cursor-pointer line-clamp-2">
                                                                    {deal.title}
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground mt-1">{deal.company}</p>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-sm text-foreground">
                                                                    {formatCurrency(deal.value)}
                                                                </span>
                                                                {deal.probability > 70 ? (
                                                                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-[10px] h-5">
                                                                        High Prob.
                                                                    </Badge>
                                                                ) : deal.probability < 30 ? (
                                                                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-[10px] h-5">
                                                                        At Risk
                                                                    </Badge>
                                                                ) : null}
                                                            </div>

                                                            <div className="space-y-1">
                                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                                    <span>Prob. {deal.probability}%</span>
                                                                    <span>{deal.owner}</span>
                                                                </div>
                                                                <Progress
                                                                    value={deal.probability}
                                                                    className={cn(
                                                                        "h-1.5",
                                                                        deal.probability > 70 ? "bg-emerald-100" :
                                                                            deal.probability < 30 ? "bg-amber-100" : "bg-blue-100"
                                                                    )}
                                                                />
                                                            </div>

                                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1 border-t">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>{new Date(deal.expectedClose).toLocaleDateString()}</span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                                {stageDeals.length === 0 && (
                                                    <div className="flex flex-col items-center justify-center p-4 text-muted-foreground border-2 border-dashed rounded-lg">
                                                        <p className="text-xs">Drag & Drop deals here</p>
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {viewMode === 'list' && (
                    <Card className="h-full overflow-hidden flex flex-col">
                        <CardHeader className="px-6 py-4 border-b">
                            <CardTitle>Opportunities List</CardTitle>
                            <CardDescription>{deals.length} active opportunities</CardDescription>
                        </CardHeader>
                        <div className="flex-1 overflow-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background z-10">
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Stage</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Probability</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Expected Close</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deals.filter(deal =>
                                        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        deal.company.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((deal) => (
                                        <TableRow key={deal.id} className="group">
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span
                                                        className="cursor-pointer hover:underline hover:text-primary"
                                                        onClick={() => handleOpenDialog(deal)}
                                                    >
                                                        {deal.title}
                                                    </span>
                                                    <Badge variant="outline" className="w-fit mt-1 text-[10px] px-1 py-0 h-4 font-normal text-muted-foreground border-transparent bg-muted">
                                                        {deal.type}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                            {deal.company.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {deal.company}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "font-medium",
                                                        DEAL_STAGES.find(s => s.id === deal.stage)?.color
                                                    )}
                                                >
                                                    {DEAL_STAGES.find(s => s.id === deal.stage)?.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold text-sm">
                                                {formatCurrency(deal.value)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 w-24">
                                                    <Progress value={deal.probability} className="h-2" />
                                                    <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-[10px]">
                                                            {deal.owner.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{deal.owner}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(deal.expectedClose).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleOpenDialog(deal)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDeal(deal.id)}>
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {deals.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                                No details found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}

                {viewMode === 'forecast' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sales Funnel</CardTitle>
                                <CardDescription>Deal distribution by stage</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <FunnelChart>
                                        <Tooltip />
                                        <Funnel
                                            dataKey="value"
                                            data={FUNNEL_DATA}
                                            isAnimationActive
                                        >
                                            <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                                            <LabelList position="inside" fill="#fff" stroke="none" dataKey="value" formatter={(val) => `${val}%`} />
                                        </Funnel>
                                    </FunnelChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Forecast</CardTitle>
                                <CardDescription>Expected vs Weighted Revenue (6 Months)</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={FORECAST_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Legend />
                                        <Bar dataKey="exact" name="Total Pipeline" fill={THEME_COLORS.primary} radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="weighted" name="Weighted Forecast" fill={THEME_COLORS.success} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Deals Closing This Month</CardTitle>
                                <CardDescription>High priority opportunities requiring attention</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px]">
                                    <div className="space-y-4">
                                        {deals.filter(d => new Date(d.expectedClose).getMonth() === new Date().getMonth()).map(deal => (
                                            <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("p-2 rounded-full",
                                                        deal.stage === 'closed_won' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                                    )}>
                                                        <Briefcase className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{deal.title}</h4>
                                                        <p className="text-sm text-muted-foreground">{deal.company} • {deal.owner}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="font-bold">{formatCurrency(deal.value)}</p>
                                                        <p className="text-xs text-muted-foreground">Value</p>
                                                    </div>
                                                    <div className="text-right w-24">
                                                        <div className="flex items-center justify-end gap-1 mb-1">
                                                            <span className="font-semibold text-sm">{deal.probability}%</span>
                                                        </div>
                                                        <Progress value={deal.probability} className="h-1.5" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper to calculate stage totals dynamically in the render if needed.
