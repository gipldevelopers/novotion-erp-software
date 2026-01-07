'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

const LEAVE_TYPE_COLORS = {
    'Casual Leave': 'bg-blue-500',
    'Sick Leave': 'bg-red-500',
    'Earned Leave': 'bg-green-500',
    'Emergency Leave': 'bg-orange-500',
    'Maternity Leave': 'bg-purple-500',
    'Paternity Leave': 'bg-indigo-500',
};

export function LeaveBalanceCard({ leaveType, total, used, pending = 0, onRequestLeave }) {
    const available = total - used - pending;
    const usedPercentage = ((used + pending) / total) * 100;
    const color = LEAVE_TYPE_COLORS[leaveType] || 'bg-gray-500';

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{leaveType}</CardTitle>
                    <div className={`h-3 w-3 rounded-full ${color}`} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="text-2xl font-bold text-green-600">{available}</div>
                        <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-600">{used}</div>
                        <div className="text-xs text-muted-foreground">Used</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-orange-600">{pending}</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <Progress value={usedPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{used + pending} / {total} days</span>
                        <span>{Math.round(usedPercentage)}% utilized</span>
                    </div>
                </div>

                {/* Request Button */}
                {onRequestLeave && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => onRequestLeave(leaveType)}
                        disabled={available <= 0}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Request {leaveType}
                    </Button>
                )}

                {/* Warning if low balance */}
                {available <= 2 && available > 0 && (
                    <div className="text-xs text-orange-600 text-center">
                        ⚠️ Low balance
                    </div>
                )}
                {available <= 0 && (
                    <div className="text-xs text-red-600 text-center">
                        ❌ No leaves available
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function LeaveBalanceGrid({ leaveBalances, onRequestLeave }) {
    if (!leaveBalances || leaveBalances.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No leave balance information available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leaveBalances.map((balance) => (
                <LeaveBalanceCard
                    key={balance.type}
                    leaveType={balance.type}
                    total={balance.total}
                    used={balance.used}
                    pending={balance.pending}
                    onRequestLeave={onRequestLeave}
                />
            ))}
        </div>
    );
}
