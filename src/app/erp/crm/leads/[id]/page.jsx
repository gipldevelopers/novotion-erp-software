'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { crmService } from '@/services/crmService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    Building2,
    MapPin,
    Calendar,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Trash2,
    ArrowRight,
    TrendingUp,
    DollarSign
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { format } from 'date-fns';

const STAGES = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function LeadDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const leadId = params.id;

    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (leadId) {
            fetchLeadDetails();
        }
    }, [leadId]);

    const fetchLeadDetails = async () => {
        try {
            setLoading(true);
            const data = await crmService.getLeadById(leadId);
            setLead(data);
        } catch (error) {
            console.error('Failed to fetch lead details', error);
            toast.error('Failed to load lead details');
        } finally {
            setLoading(false);
        }
    };

    const handleStageUpdate = async (newStage) => {
        try {
            const updatedLead = await crmService.updateLeadStage(leadId, newStage);
            setLead(updatedLead);
            toast.success(`Lead stage updated to ${newStage}`);
        } catch (error) {
            // Fallback for mock service limitation if explicit update method fails or returns null
            // In a real app index based update would be handled in service
            console.error('Failed to update stage', error);
            toast.error('Failed to update lead stage');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">Loading lead details...</p>
                </div>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Lead not found</h2>
                    <p className="text-muted-foreground mt-2">The lead you're looking for doesn't exist.</p>
                </div>
                <Button onClick={() => router.push('/erp/crm/leads')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Leads
                </Button>
            </div>
        );
    }

    const currentStageIndex = STAGES.indexOf(lead.stage);

    return (
        <div className="min-h-screen bg-background p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/erp/crm/leads')}
                        className="hover:bg-accent"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/10">
                            <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                {lead.name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">{lead.name}</h1>
                                <Badge variant="outline" className="text-base px-3 py-0.5">
                                    {lead.stage}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                                <span>{lead.company}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <span>ID: {lead.id}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <span>Created {lead.createdAt ? format(new Date(lead.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.push(`/erp/crm/leads/${leadId}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Lead
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Convert to Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Lead
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Pipeline Progress */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative flex justify-between">
                        {/* Connection Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2" />

                        {STAGES.map((stage, index) => {
                            const isCompleted = index <= currentStageIndex;
                            const isCurrent = index === currentStageIndex;

                            return (
                                <div key={stage} className="flex flex-col items-center gap-2 bg-background px-2 cursor-pointer" onClick={() => handleStageUpdate(stage)}>
                                    <div className={`
                                  h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors
                                  ${isCompleted
                                            ? 'bg-primary border-primary text-primary-foreground'
                                            : 'bg-background border-muted text-muted-foreground hover:border-primary/50'
                                        }
                              `}>
                                        {index + 1}
                                    </div>
                                    <span className={`text-sm font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {stage}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Email</p>
                                            <p className="text-muted-foreground">{lead.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Phone</p>
                                            <p className="text-muted-foreground">{lead.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Company</p>
                                            <p className="text-muted-foreground">{lead.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Expected Value</p>
                                            <p className="text-muted-foreground">
                                                {lead.expectedRevenue ? `₹${lead.expectedRevenue.toLocaleString()}` : (lead.value ? `₹${lead.value.toLocaleString()}` : 'N/A')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes & Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {lead.details || lead.notes || 'No notes available for this lead.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Stats & Meta */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="relative flex items-center justify-center">
                                    <svg className="h-32 w-32 transform -rotate-90">
                                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * (lead.score || 0)) / 100} className="text-primary transition-all duration-1000 ease-out" />
                                    </svg>
                                    <span className="absolute text-4xl font-bold">{lead.score || 0}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">
                                    {lead.score > 70 ? 'Hot Lead' : (lead.score > 40 ? 'Warm Lead' : 'Cold Lead')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Closing Probability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Probability</span>
                                    <span className="font-bold">{lead.probability || 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-500"
                                        style={{ width: `${lead.probability || 0}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
