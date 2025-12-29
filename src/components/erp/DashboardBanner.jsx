import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

export const DashboardBanner = () => {
    const stats = [
        { label: 'Today Revenue', value: '$12,450', icon: DollarSign, trend: '+12%', color: 'text-emerald-500' },
        { label: 'New CRM', value: '24', icon: Users, trend: '+5%', color: 'text-blue-500' },
        { label: 'Active Sessions', value: '8', icon: TrendingUp, trend: 'Stable', color: 'text-premium-1' },
    ];

    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-2xl animate-fade-in group">
            {/* Professional Geometric Accents */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-1000" />

            <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-xl space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Calendar size={14} className="text-primary-foreground" />
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none">
                            System <span className="text-primary">Overview</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                            Welcome back, Admin. Your enterprise performance is <span className="text-emerald-400">up 15.2%</span> compared to last quarter.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 h-14 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                            Core Analytics
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="ghost" className="text-white hover:bg-white/10 rounded-2xl px-8 h-14 font-bold border border-white/10">
                            Quick Reports
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 w-full lg:w-72">
                    {stats.map((stat, i) => (
                        <div key={i} className="group/item relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/5 rounded-2xl p-5 transition-all cursor-default">
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-xl font-black text-white">{stat.value}</p>
                                </div>
                                <div className={`p-2.5 rounded-xl bg-slate-800 border border-white/5 ${stat.color} group-hover/item:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-1.5">
                                <span className={`text-[10px] font-black ${stat.trend.includes('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
                                    {stat.trend}
                                </span>
                                <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${stat.trend.includes('+') ? 'bg-emerald-500' : 'bg-slate-500'} w-2/3 opacity-30`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
