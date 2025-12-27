'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Phone, Mail, Users, CheckSquare, Calendar, History } from 'lucide-react';

export default function CustomerActivity({ activity }) {
    if (!activity || activity.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <History className="h-8 w-8 mb-2 opacity-50" />
                    <p>No activity recorded yet.</p>
                </CardContent>
            </Card>
        );
    }

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
        <Card>
            <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Interactions and updates.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {activity.map((item, index) => (
                        <div key={item.id || index} className="flex gap-4 relative">
                            {index !== activity.length - 1 && (
                                <div className="absolute left-[1.3rem] top-8 bottom-0 w-px bg-border -z-10" />
                            )}
                            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted border">
                                {getIcon(item.type)}
                            </div>
                            <div className="flex-1 space-y-1 pt-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium leading-none">{item.subject}</p>
                                    <span className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
