import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Activity, CreditCard } from 'lucide-react';

export const PerformanceSummary = () => {
    const metrics = [
        { title: 'Revenue Target', current: 85000, target: 120000, color: 'bg-primary', icon: Target },
        { title: 'Operational Efficiency', current: 72, target: 100, color: 'bg-premium-1', icon: Activity },
        { title: 'Budget Utilization', current: 32000, target: 45000, color: 'bg-premium-2', icon: CreditCard },
    ];

    return (
        <div className="space-y-4">
            {metrics.map((metric, i) => (
                <div key={i} className="group p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${metric.color}/10 ${metric.color.replace('bg-', 'text-')} transition-colors group-hover:bg-opacity-20`}>
                                <metric.icon size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{metric.title}</p>
                                <p className="text-sm font-bold text-card-foreground">System Health: {metric.current > metric.target * 0.7 ? 'Stable' : 'Attention'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black tracking-tight">
                                {metric.title.includes('Efficiency') ? `${metric.current}%` : `$${metric.current.toLocaleString()}`}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <span>Analysis</span>
                            <span>{Math.round((metric.current / metric.target) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${metric.color} transition-all duration-1000 ease-out`}
                                style={{ width: `${(metric.current / metric.target) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
