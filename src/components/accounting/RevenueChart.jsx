'use client';

import { Card } from '@/components/ui/card';

export function RevenueChart({ data }) {
    if (!data || !data.monthly) return null;

    const maxAmount = Math.max(...data.monthly.map(d => d.amount));

    return (
        <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold">Revenue Trend</h3>
                    <p className="text-sm text-muted-foreground">Monthly revenue performance</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-green-600 font-medium">+{data.growth}% YTD</div>
                </div>
            </div>

            <div className="flex items-end gap-2 h-48 mt-4">
                {data.monthly.map((item, index) => {
                    const height = (item.amount / maxAmount) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center group cursor-pointer">
                            <div className="w-full relative flex-1 flex items-end bg-muted/30 rounded-t-sm hover:bg-muted/50 transition-colors">
                                <div
                                    className="w-full bg-primary rounded-t-sm relative transition-all duration-500 group-hover:bg-primary/90"
                                    style={{ height: `${height}%` }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        ₹{item.amount.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground mt-2">{item.month}</span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
