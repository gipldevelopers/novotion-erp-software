'use client';

import React, { useEffect, useState } from 'react';
import { crmService } from '@/services/crmService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Users, CheckSquare, Calendar, ArrowUpRight } from 'lucide-react';

export default function ActivitiesPage() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await crmService.getActivities();
                setActivities(data);
            } catch (error) {
                console.error('Failed to fetch activities', error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'Call': return <Phone className="h-4 w-4" />;
            case 'Email': return <Mail className="h-4 w-4" />;
            case 'Meeting': return <Users className="h-4 w-4" />;
            case 'Task': return <CheckSquare className="h-4 w-4" />;
            default: return <Calendar className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6 p-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Activities</h2>
                <p className="text-muted-foreground">Track all interactions and scheduled events.</p>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center py-8">Loading activities...</div>
                ) : (
                    activities.map((activity) => (
                        <Card key={activity.id}>
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="rounded-full bg-primary/10 p-3 text-primary mt-1">
                                    {getIcon(activity.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">{activity.subject}</h3>
                                        <Badge variant={activity.status === 'Completed' ? 'default' : 'outline'}>
                                            {activity.status}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{activity.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(activity.date).toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ArrowUpRight className="h-3 w-3" />
                                            Related to {activity.relatedTo}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
