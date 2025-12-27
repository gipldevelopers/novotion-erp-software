'use client';

import React, { useState, useEffect } from 'react';
import { crmService } from '@/services/crmService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2,
    Phone, Mail, Users, Plus, User, Filter, LayoutGrid, Rows
} from 'lucide-react';
import {
    format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth,
    isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday,
    addWeeks, subWeeks, parseISO
} from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CRMCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // 'month' | 'week'
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    // Filters
    const [filterType, setFilterType] = useState('all');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        type: 'Task',
        date: '',
        time: '09:00',
        assignedTo: 'Admin User',
        priority: 'Medium',
        description: '',
        status: 'Pending'
    });

    const fetchEvents = async () => {
        try {
            const [activities, tasks] = await Promise.all([
                crmService.getActivities(),
                crmService.getTasks()
            ]);

            const formattedActivities = activities.map(a => ({
                id: a.id,
                title: a.subject,
                date: new Date(a.date),
                type: a.type,
                category: 'activity',
                status: a.status,
                description: a.description,
                assignedTo: 'Self'
            }));

            const formattedTasks = tasks.map(t => ({
                id: t.id,
                title: t.title,
                date: new Date(t.dueDate),
                type: 'Task',
                category: 'task',
                status: t.status,
                priority: t.priority,
                assignedTo: t.assignedTo,
                description: ''
            }));

            setEvents([...formattedActivities, ...formattedTasks]);
        } catch (error) {
            console.error('Failed to load calendar events', error);
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDayClick = (day) => {
        setEditingEvent(null);
        setFormData({
            title: '',
            type: 'Task',
            date: format(day, 'yyyy-MM-dd'),
            time: '09:00',
            assignedTo: 'Admin User',
            priority: 'Medium',
            description: '',
            status: 'Not Started'
        });
        setIsDialogOpen(true);
    };

    const handleEventClick = (e, event) => {
        e.stopPropagation();
        setEditingEvent(event);
        setFormData({
            title: event.title,
            type: event.type === 'Task' ? 'Task' : 'Activity',
            activityType: event.category === 'activity' ? event.type : 'Meeting',
            date: format(event.date, 'yyyy-MM-dd'),
            time: format(event.date, 'HH:mm'),
            assignedTo: event.assignedTo,
            priority: event.priority || 'Medium',
            description: event.description || '',
            status: event.status
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateTime = new Date(`${formData.date}T${formData.time}`);

        try {
            if (editingEvent) {
                if (editingEvent.category === 'task') {
                    await crmService.updateTask(editingEvent.id, {
                        title: formData.title,
                        dueDate: dateTime.toISOString(),
                        assignedTo: formData.assignedTo,
                        priority: formData.priority,
                        status: formData.status
                    });
                } else {
                    await crmService.updateActivity(editingEvent.id, {
                        subject: formData.title,
                        date: dateTime.toISOString(),
                        description: formData.description,
                        status: formData.status
                    });
                }
                toast.success("Event updated");
            } else {
                if (formData.type === 'Task') {
                    await crmService.createTask({
                        title: formData.title,
                        dueDate: dateTime.toISOString(),
                        assignedTo: formData.assignedTo,
                        priority: formData.priority,
                        status: formData.status
                    });
                } else {
                    await crmService.createActivity({
                        type: formData.activityType || 'Meeting',
                        subject: formData.title,
                        date: dateTime.toISOString(),
                        description: formData.description,
                        status: 'Scheduled'
                    });
                }
                toast.success("Event created");
            }
            setIsDialogOpen(false);
            fetchEvents();
        } catch (error) {
            toast.error("Action failed");
        }
    };

    // Drag and Drop Logic
    const handleDragStart = (e, event) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(event));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, date) => {
        e.preventDefault();
        const eventData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const newDate = new Date(date);
        // Keep original time, change date
        const originalDate = new Date(eventData.date);
        newDate.setHours(originalDate.getHours(), originalDate.getMinutes());

        try {
            if (eventData.category === 'task') {
                await crmService.updateTask(eventData.id, { dueDate: newDate.toISOString() });
            } else {
                await crmService.updateActivity(eventData.id, { date: newDate.toISOString() });
            }
            toast.success(`Rescheduled to ${format(newDate, 'MMM d')}`);
            fetchEvents(); // Refresh
        } catch (err) {
            toast.error("Failed to move event");
        }
    };

    // Calendar Navigation
    const next = () => setCurrentDate(view === 'month' ? addMonths(currentDate, 1) : addWeeks(currentDate, 1));
    const prev = () => setCurrentDate(view === 'month' ? subMonths(currentDate, 1) : subWeeks(currentDate, 1));
    const jumpToToday = () => setCurrentDate(new Date());

    // Date Headers
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const start = view === 'month' ? startOfWeek(monthStart) : startOfWeek(currentDate);
    const end = view === 'month' ? endOfWeek(monthEnd) : endOfWeek(currentDate);
    const calendarDays = eachDayOfInterval({ start, end });

    const getDayEvents = (day) => {
        return events.filter(event =>
            isSameDay(event.date, day) &&
            (filterType === 'all' || event.type === filterType || (filterType === 'Task' && event.category === 'task'))
        );
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'Call': return <Phone className="h-3 w-3" />;
            case 'Email': return <Mail className="h-3 w-3" />;
            case 'Meeting': return <Users className="h-3 w-3" />;
            case 'Task': return <CheckCircle2 className="h-3 w-3" />;
            default: return <Clock className="h-3 w-3" />;
        }
    };

    const getEventColor = (event) => {
        if (event.category === 'task') {
            return event.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' :
                event.priority === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200' :
                    'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
        }
        return 'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200';
    };

    return (
        <div className="p-8 space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Advanced Planner</h2>
                    <p className="text-muted-foreground">Drag and drop to reschedule tasks.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[120px]">
                            <StartIcon icon={Filter} className="mr-2" />
                            <SelectValue placeholder="All Events" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Events</SelectItem>
                            <SelectItem value="Task">Tasks</SelectItem>
                            <SelectItem value="Meeting">Meetings</SelectItem>
                            <SelectItem value="Call">Calls</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="h-8 w-px bg-border mx-2" />

                    <div className="flex bg-muted rounded-lg p-1">
                        <Button
                            variant={view === 'month' ? 'white' : 'ghost'}
                            size="sm"
                            className={cn(view === 'month' && "bg-background shadow-sm")}
                            onClick={() => setView('month')}
                        >
                            <LayoutGrid className="h-4 w-4 mr-2" /> Month
                        </Button>
                        <Button
                            variant={view === 'week' ? 'white' : 'ghost'}
                            size="sm"
                            className={cn(view === 'week' && "bg-background shadow-sm")}
                            onClick={() => setView('week')}
                        >
                            <Rows className="h-4 w-4 mr-2" /> Week
                        </Button>
                    </div>

                    <div className="flex items-center border rounded-md bg-background ml-4">
                        <Button variant="ghost" size="icon" onClick={prev}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="w-[140px] text-center font-medium">
                            {format(currentDate, view === 'month' ? 'MMMM yyyy' : "'Week of ' MMM d")}
                        </div>
                        <Button variant="ghost" size="icon" onClick={next}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="outline" onClick={jumpToToday}>Today</Button>
                    <Button onClick={() => handleDayClick(new Date())}>
                        <Plus className="mr-2 h-4 w-4" /> New
                    </Button>
                </div>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden shadow-md border-0 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
                <div className="grid grid-cols-7 border-b text-center py-3 bg-muted/30 font-semibold text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className={cn(
                    "flex-1 grid grid-cols-7",
                    view === 'month' ? "grid-rows-6" : "grid-rows-1"
                )}>
                    {calendarDays.map((day) => {
                        const dayEvents = getDayEvents(day);
                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "border-b border-r p-2 flex flex-col gap-1 transition-all hover:bg-accent/10 relative group min-h-[100px]",
                                    !isSameMonth(day, currentDate) && view === 'month' && "bg-muted/5 text-muted-foreground",
                                    isToday(day) && "bg-primary/5 ring-1 ring-inset ring-primary/20"
                                )}
                                onClick={() => handleDayClick(day)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, day)}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={cn(
                                        "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 transition-colors",
                                        isToday(day) ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/70"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                </div>

                                <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                                    {dayEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, event)}
                                            onClick={(e) => handleEventClick(e, event)}
                                            className={cn(
                                                "text-[11px] px-2 py-1 rounded-md border truncate flex items-center gap-1.5 cursor-grab active:cursor-grabbing font-medium shadow-sm hover:shadow-md transition-all hover:scale-[1.02]",
                                                getEventColor(event)
                                            )}
                                        >
                                            {getEventIcon(event.type)}
                                            <span className="truncate">{event.title}</span>
                                        </div>
                                    ))}
                                </div>
                                {view === 'week' && (
                                    <div className="absolute inset-0 border-2 border-primary/0 pointer-events-none group-hover:border-primary/10 transition-colors" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                        <DialogDescription>
                            {editingEvent ? 'Update details or reassign.' : 'Add a task or schedule an activity.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="flex gap-4">
                            <div className="grid w-full items-center gap-1.5">
                                <Label>Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                    disabled={!!editingEvent && editingEvent.category !== 'task'}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Task">Task</SelectItem>
                                        <SelectItem value="Activity">Activity</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.type === 'Activity' && (
                                <div className="grid w-full items-center gap-1.5">
                                    <Label>Category</Label>
                                    <Select value={formData.activityType} onValueChange={(val) => setFormData({ ...formData, activityType: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Meeting">Meeting</SelectItem>
                                            <SelectItem value="Call">Call</SelectItem>
                                            <SelectItem value="Email">Email</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label>Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5 relative">
                            <Label>Assign To</Label>
                            <div className="relative">
                                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={formData.assignedTo}
                                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                    className="pl-9"
                                    placeholder="User Name"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="grid w-full items-center gap-1.5">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid w-[120px] items-center gap-1.5">
                                <Label>Time</Label>
                                <Input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {formData.type === 'Task' && (
                            <div className="grid w-full items-center gap-1.5">
                                <Label>Priority</Label>
                                <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="grid w-full items-center gap-1.5">
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="w-full sm:w-auto">{editingEvent ? 'Save Changes' : 'Create Event'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const StartIcon = ({ icon: Icon, className }) => <Icon className={className} />;
