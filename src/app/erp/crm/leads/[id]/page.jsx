// Updated: 2025-12-27
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { crmService } from '@/services/crmService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Mail, Phone, Building, DollarSign, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function LeadDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const data = await crmService.getLeadById(id);
                setLead(data);
            } catch (error) {
                console.error('Failed to fetch lead', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchLead();
    }, [id]);

    if (loading) {
        return <div className="p-8 text-center">Loading lead...</div>;
    }

    if (!lead) {
        return <div className="p-8 text-center">Lead not found</div>;
    }

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{lead.name}</h2>
                    <p className="text-muted-foreground">{lead.company}</p>
                </div>
                <Badge className="ml-auto text-base px-4 py-1" variant="secondary">{lead.stage}</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Deal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Estimated Value</span>
                            <div className="flex items-center font-bold text-lg text-emerald-600">
                                <DollarSign className="h-5 w-5" />
                                {lead.value.toLocaleString()}
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Source</span>
                            <span className="font-medium">{lead.source}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Created Date</span>
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-full">
                                <Mail className="h-4 w-4" />
                            </div>
                            <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-full">
                                <Phone className="h-4 w-4" />
                            </div>
                            <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-full">
                                <Building className="h-4 w-4" />
                            </div>
                            <span>{lead.company}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
