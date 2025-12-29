'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ACTIVITY_ICONS = {
    'clock-in': Clock,
    'clock-out': Clock,
    'leave-request': Calendar,
    'leave-approved': CheckCircle2,
    'leave-rejected': AlertCircle,
    'performance-review': Info,
    'document-upload': Info,
    'default': Info,
};

const ACTIVITY_COLORS = {
    'clock-in': 'text-green-600 bg-green-50',
    'clock-out': 'text-blue-600 bg-blue-50',
    'leave-request': 'text-orange-600 bg-orange-50',
    'leave-approved': 'text-green-600 bg-green-50',
    'leave-rejected': 'text-red-600 bg-red-50',
    'performance-review': 'text-purple-600 bg-purple-50',
    'document-upload': 'text-blue-600 bg-blue-50',
    'default': 'text-gray-600 bg-gray-50',
};

export function TimelineWidget({ activities = [], maxItems = 10 }) {
    const sortedActivities = [...activities]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, maxItems);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const groupByDate = (activities) => {
        const groups = {};
        activities.forEach(activity => {
            const date = new Date(activity.timestamp).toLocaleDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(activity);
        });
        return groups;
    };

    const groupedActivities = groupByDate(sortedActivities);

    if (sortedActivities.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8 text-muted-foreground">
                    <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activities</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                        <div key={date}>
                            <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase">
                                {date}
                            </div>
                            <div className="space-y-3">
                                {dateActivities.map((activity, index) => {
                                    const Icon = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.default;
                                    const colorClass = ACTIVITY_COLORS[activity.type] || ACTIVITY_COLORS.default;

                                    return (
                                        <div key={index} className="flex gap-3 items-start">
                                            <div className={`p-2 rounded-lg ${colorClass}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium leading-tight">
                                                            {activity.title}
                                                        </p>
                                                        {activity.description && (
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {activity.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {formatTimestamp(activity.timestamp)}
                                                    </span>
                                                </div>
                                                {activity.badge && (
                                                    <Badge variant="outline" className="mt-2 text-xs">
                                                        {activity.badge}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
