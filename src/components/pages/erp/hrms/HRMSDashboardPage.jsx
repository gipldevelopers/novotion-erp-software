
import React, { useState, useEffect } from 'react';
import {
    Clock, MapPin, Coffee, Calendar, CalendarDays, ChevronRight,
    MessageSquare, ThumbsUp, PartyPopper, Cake, Users,
    Timer, ArrowRight, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Using a mock hook for time, in real app would use a reliable interval
const useCurrentTime = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return time;
};

export const HRMSDashboardPage = () => {
    const currentTime = useCurrentTime();
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [clockInTime, setClockInTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState('00:00:00');

    // Simulate clock timer
    useEffect(() => {
        if (isClockedIn && clockInTime) {
            const interval = setInterval(() => {
                const diff = new Date() - clockInTime;
                const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                setElapsedTime(`${hours}:${minutes}:${seconds}`);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isClockedIn, clockInTime]);

    const handleClockAction = () => {
        if (!isClockedIn) {
            setClockInTime(new Date());
            setIsClockedIn(true);
        } else {
            setIsClockedIn(false);
            setClockInTime(null);
            setElapsedTime('00:00:00');
        }
    };

    const leaveBalances = [
        { type: 'Privilege Leave', balance: 12, total: 18, color: 'bg-emerald-500', text: 'text-emerald-500' },
        { type: 'Sick Leave', balance: 4, total: 10, color: 'bg-rose-500', text: 'text-rose-500' },
        { type: 'Casual Leave', balance: 2, total: 8, color: 'bg-blue-500', text: 'text-blue-500' },
    ];

    const timeline = [
        { time: '09:02 AM', title: 'Web Clock In', subtitle: 'On Time', icon: Clock, color: 'text-success bg-success/10' },
        { time: '01:15 PM', title: 'Work From Home Approved', subtitle: 'Requires Logs', icon: MapPin, color: 'text-blue-500 bg-blue-500/10' },
    ];

    const peersOnLeave = [
        { name: 'Sarah Wilson', type: 'Sick Leave', avatar: '/avatars/01.png' },
        { name: 'Mike Ross', type: 'Privilege Leave', avatar: '/avatars/02.png' },
        { name: 'Jessica Pearson', type: 'WFH', avatar: '/avatars/03.png' },
    ];

    return (
        <div className="space-y-8 animate-fade-in p-6 lg:p-8">

            {/* Header: Greeting & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        Hello, <span className="text-primary">Admin User</span>
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                        Welcome to your personalized workspace. Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="rounded-xl shadow-lg shadow-primary/20 font-bold">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Apply Leave
                    </Button>
                    <Button variant="outline" className="rounded-xl border-dashed font-bold">
                        <Coffee className="mr-2 h-4 w-4" />
                        Request Break
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: ME - ATTENDANCE & TIMELINE */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Clock In Wiget */}
                    <Card className="border-none shadow-2xl shadow-primary/5 bg-gradient-to-br from-card to-card/50 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Current Time</p>
                                <h2 className="text-4xl font-black tracking-tighter text-foreground tabular-nums">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </h2>
                                <p className="text-xs font-medium text-slate-400">
                                    {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>

                            <div className="w-full flex justify-center">
                                <Button
                                    size="lg"
                                    onClick={handleClockAction}
                                    className={`w-40 h-40 rounded-full text-white shadow-2xl border-4 border-white/10 flex flex-col items-center justify-center gap-2 transition-all duration-500 hover:scale-105 active:scale-95 ${isClockedIn
                                            ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                                            : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                                        }`}
                                >
                                    {isClockedIn ? <Timer size={32} /> : <MapPin size={32} />}
                                    <span className="text-sm font-black uppercase tracking-widest">
                                        {isClockedIn ? 'Clock Out' : 'Clock In'}
                                    </span>
                                </Button>
                            </div>

                            {isClockedIn && (
                                <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Session Duration</p>
                                    <p className="text-2xl font-black text-primary tabular-nums">{elapsedTime}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                                <MapPin size={10} />
                                <span>IP: 192.168.1.1 (Office Network)</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline / Logs */}
                    <Card className="border border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Today's Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="relative space-y-6">
                                {timeline.map((item, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                                            <item.icon size={16} />
                                        </div>
                                        {i !== timeline.length - 1 && (
                                            <div className="absolute top-10 left-5 h-full w-px bg-border border-dashed" />
                                        )}
                                        <div className="flex-1 pt-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-bold text-foreground leading-none">{item.title}</h4>
                                                <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 font-medium">{item.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* MIDDLE COLUMN: STATS & BALANCES */}
                <div className="lg:col-span-5 space-y-8">

                    {/* Leave Balances */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {leaveBalances.map((leave, i) => (
                            <Card key={i} className="border border-border/50 shadow-sm relative overflow-hidden group hover:border-primary/20 transition-colors">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className={`p-2 rounded-lg ${leave.color}/10 ${leave.text}`}>
                                            <Calendar size={18} />
                                        </div>
                                        <span className="text-xs font-black text-slate-300">2024</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-foreground">{leave.balance}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">{leave.type}</p>
                                    </div>
                                    <Progress value={(leave.balance / leave.total) * 100} className="h-1" />
                                    <p className="text-[10px] text-slate-400 text-right">Available of {leave.total}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-5 border border-dashed border-border flex flex-col justify-center items-center text-center gap-2 hover:bg-muted/30 transition-colors">
                            <Clock size={24} className="text-blue-500 mb-1" />
                            <h3 className="text-xl font-black text-foreground">45h 12m</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Weekly Avg</p>
                        </Card>
                        <Card className="p-5 border border-dashed border-border flex flex-col justify-center items-center text-center gap-2 hover:bg-muted/30 transition-colors">
                            <ThumbsUp size={24} className="text-emerald-500 mb-1" />
                            <h3 className="text-xl font-black text-foreground">100%</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">On-Time Arrival</p>
                        </Card>
                    </div>

                    {/* Pending Actions */}
                    <Card className="border border-orange-200 bg-orange-50/50 dark:bg-orange-950/10 dark:border-orange-900/50">
                        <CardContent className="p-5 flex items-start gap-4">
                            <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-foreground">Attendance Regularization Pending</h4>
                                <p className="text-xs text-muted-foreground mt-1 mb-3">You have a missing swipe for Dec 24th. Please regularize to avoid Lop.</p>
                                <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-orange-200 hover:bg-orange-100 dark:border-orange-800 dark:hover:bg-orange-900/50">
                                    Fix Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Access List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Employee Quick Links</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {[
                                { label: 'Payslips & Tax', icon: ArrowRight },
                                { label: 'Company Policies', icon: ArrowRight },
                                { label: 'Holiday Calendar', icon: ArrowRight },
                                { label: 'Help Desk', icon: MessageSquare },
                            ].map((link, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors group">
                                    <span className="text-sm font-medium">{link.label}</span>
                                    <link.icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: TEAM & HAPPENINGS */}
                <div className="lg:col-span-3 space-y-8">

                    {/* Who is on leave */}
                    <Card className="border border-border/50 shadow-sm h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Users size={16} />
                                Who's Off Today
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="space-y-5">
                                {peersOnLeave.map((peer, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-background flex items-center justify-center font-bold text-xs">
                                                {peer.name.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-background" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-none">{peer.name}</p>
                                            <Badge variant="outline" className="mt-1 text-[9px] h-5 px-1.5 font-bold uppercase border-slate-200 text-slate-500">
                                                {peer.type}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-6 text-xs font-bold uppercase tracking-widest text-primary">View Team Calendar</Button>
                        </CardContent>
                    </Card>

                    {/* Celebrations */}
                    <Card className="bg-gradient-to-b from-primary/5 to-transparent border-none">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-background flex items-center justify-center shadow-sm">
                                <Cake className="text-rose-500 animate-bounce" size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-foreground">Birthdays</h4>
                                <p className="text-xs text-muted-foreground mt-1">No birthdays today.</p>
                                <p className="text-xs font-bold text-primary mt-2">Upcoming: John (Dec 30)</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};
