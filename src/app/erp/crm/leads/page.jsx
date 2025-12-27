// Updated: 2025-12-27
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { crmService } from '@/services/crmService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Plus, MoreHorizontal, DollarSign, Calendar } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STAGES = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function LeadsPage() {
    const router = useRouter();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedLead, setDraggedLead] = useState(null);

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

        // Optimistic update
        const updatedLeads = leads.map(l =>
            l.id === draggedLead.id ? { ...l, stage } : l
        );
        setLeads(updatedLeads);

        try {
            await crmService.updateLeadStage(draggedLead.id, stage);
            toast.success(`Lead moved to ${stage}`);
        } catch (error) {
            console.error('Failed to update lead stage', error);
            toast.error('Failed to save change');
            fetchLeads(); // Revert on error
        } finally {
            setDraggedLead(null);
        }
    };

    const getLeadsByStage = (stage) => leads.filter(lead => lead.stage === stage);

    if (loading) {
        return <div className="p-8 flex items-center justify-center min-h-[500px]">Loading pipeline...</div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] p-6 space-y-4">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leads Pipeline</h2>
                    <p className="text-muted-foreground">Manage your sales pipeline.</p>
                </div>
                <Button onClick={() => router.push('/erp/crm/leads/create')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Lead
                </Button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex h-full gap-4 min-w-[1200px] pb-4">
                    {STAGES.map((stage) => (
                        <div
                            key={stage}
                            className="flex-1 flex flex-col min-w-[280px] bg-muted/40 rounded-lg border border-border/50"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage)}
                        >
                            <div className={cn(
                                "p-3 border-b border-border/50 flex items-center justify-between font-semibold text-sm uppercase tracking-wide",
                                stage === 'Closed Won' ? 'text-green-600 bg-green-50/50' :
                                    stage === 'Closed Lost' ? 'text-red-600 bg-red-50/50' :
                                        'text-muted-foreground'
                            )}>
                                {stage}
                                <Badge variant="outline" className="ml-2">{getLeadsByStage(stage).length}</Badge>
                            </div>

                            <div className="flex-1 p-2 space-y-3 overflow-y-auto">
                                {getLeadsByStage(stage).map((lead) => (
                                    <Card
                                        key={lead.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, lead)}
                                        className="cursor-move hover:shadow-md transition-shadow active:shadow-lg active:scale-[1.02] duration-200"
                                    >
                                        <CardContent className="p-3 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div
                                                    className="font-medium hover:text-primary cursor-pointer truncate"
                                                    onClick={() => router.push(`/erp/crm/leads/${lead.id}`)}
                                                >
                                                    {lead.name}
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-6 w-6 p-0 -mr-2">
                                                            <MoreHorizontal className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.push(`/erp/crm/leads/${lead.id}`)}>
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {STAGES.map(s => (
                                                            s !== lead.stage && (
                                                                <DropdownMenuItem key={s} onClick={() => handleDrop({ preventDefault: () => { } }, s)}>
                                                                    Move to {s}
                                                                </DropdownMenuItem>
                                                            )
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{lead.company}</p>

                                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                                                <DollarSign className="h-3 w-3" />
                                                {lead.value.toLocaleString()}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-3 pt-0 text-xs text-muted-foreground flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
