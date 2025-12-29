import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    User,
    ShoppingCart,
    FileText,
    Package,
    Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const activities = [
    {
        id: 1,
        type: 'sale',
        title: 'New Transaction',
        description: 'Invoice #INV-2023-001 processed',
        time: '2 mins ago',
        icon: ShoppingCart,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        id: 2,
        type: 'customer',
        title: 'Lead Conversion',
        description: 'Acme Corp transitioned to Client',
        time: '45 mins ago',
        icon: User,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
    },
    {
        id: 3,
        type: 'inventory',
        title: 'Stock Update',
        description: 'Inventory levels synchronized',
        time: '2 hours ago',
        icon: Package,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    {
        id: 4,
        type: 'payment',
        title: 'Payment Approval',
        description: 'ACH Transfer approved for $5,240',
        time: '5 hours ago',
        icon: FileText,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
    },
    {
        id: 5,
        type: 'system',
        title: 'Core Engine Update',
        description: 'Security patches applied',
        time: 'Today',
        icon: Settings,
        color: 'text-slate-500',
        bg: 'bg-slate-500/10',
    },
];

export const ActivityFeed = ({ className }) => {
    return (
        <Card className={cn("overflow-hidden border border-border shadow-sm bg-card", className)}>
            <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-black tracking-tight uppercase">System Logs</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Activity</CardDescription>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse border border-emerald-500/20">
                        Live
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-8">
                    {activities.map((activity, index) => (
                        <div key={activity.id} className="relative flex gap-4">
                            {index !== activities.length - 1 && (
                                <div className="absolute left-[19px] top-10 bottom-[-32px] w-px border-l border-dashed border-border" />
                            )}
                            <div className={cn(
                                "flex-shrink-0 w-10 h-10 rounded-[1rem] flex items-center justify-center transition-all duration-300 border border-border bg-card shadow-sm",
                                activity.color
                            )}>
                                <activity.icon size={18} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="font-bold text-sm leading-none">{activity.title}</p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{activity.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium line-clamp-1">{activity.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
