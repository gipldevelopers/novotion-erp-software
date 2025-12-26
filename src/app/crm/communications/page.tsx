'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Send,
  Paperclip,
  MoreVertical,
  FileText,
  Video,
  Link as LinkIcon,
  Clock as ClockIcon,
  Trash2,
  Edit,
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

const initialActivities = [
  {
    id: 1,
    type: 'email',
    subject: 'Follow-up on proposal discussion',
    customer: 'Sarah Johnson',
    company: 'Tech Innovations',
    status: 'sent',
    priority: 'high',
    assignedTo: 'John Doe',
    date: '2024-01-23T10:30:00',
    notes: 'Sent detailed proposal with pricing breakdown',
  },
  {
    id: 2,
    type: 'call',
    subject: 'Product demo scheduled',
    customer: 'Michael Chen',
    company: 'Digital Solutions',
    status: 'scheduled',
    priority: 'medium',
    assignedTo: 'Jane Smith',
    date: '2024-01-25T14:00:00',
    notes: 'Demo for enterprise package features',
  },
  {
    id: 3,
    type: 'meeting',
    subject: 'Contract negotiation meeting',
    customer: 'Emma Davis',
    company: 'Global Corp',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Mike Johnson',
    date: '2024-01-22T15:30:00',
    notes: 'Discussed terms and pricing adjustments',
  },
  {
    id: 4,
    type: 'task',
    subject: 'Prepare quarterly report',
    customer: 'Robert Wilson',
    company: 'Innovation Labs',
    status: 'pending',
    priority: 'low',
    assignedTo: 'Sarah Davis',
    date: '2024-01-26T09:00:00',
    notes: 'Include customer satisfaction metrics',
  },
  {
    id: 5,
    type: 'email',
    subject: 'Thank you for the meeting',
    customer: 'Lisa Anderson',
    company: 'Smart Systems',
    status: 'sent',
    priority: 'medium',
    assignedTo: 'Tom Wilson',
    date: '2024-01-23T16:45:00',
    notes: 'Follow-up after successful product demo',
  },
];

const tasks = [
  {
    id: 1,
    title: 'Send proposal to Acme Corp',
    assignedTo: 'John Doe',
    dueDate: '2024-01-25',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Follow up with Tech Innovations',
    assignedTo: 'Jane Smith',
    dueDate: '2024-01-24',
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: 3,
    title: 'Prepare demo for Digital Solutions',
    assignedTo: 'Mike Johnson',
    dueDate: '2024-01-26',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 4,
    title: 'Update CRM records',
    assignedTo: 'Sarah Davis',
    dueDate: '2024-01-27',
    status: 'completed',
    priority: 'low',
  },
];

const stats = [
  {
    label: 'Total Communications',
    value: '1,234',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Pending Tasks',
    value: '47',
    icon: Clock,
    color: 'from-orange-500 to-red-500',
  },
  {
    label: 'Scheduled Meetings',
    value: '18',
    icon: Calendar,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Response Rate',
    value: '94%',
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-500',
  },
];

const activityIcons = {
  email: Mail,
  call: Phone,
  meeting: Video,
  task: FileText,
};

const statusConfig = {
  sent: { bg: 'bg-green-50   :bg-green-950', text: 'text-green-600   :text-green-400', border: 'border-green-200   :border-green-800' },
  scheduled: { bg: 'bg-blue-50   :bg-blue-950', text: 'text-blue-600   :text-blue-400', border: 'border-blue-200   :border-blue-800' },
  completed: { bg: 'bg-purple-50   :bg-purple-950', text: 'text-purple-600   :text-purple-400', border: 'border-purple-200   :border-purple-800' },
  pending: { bg: 'bg-orange-50   :bg-orange-950', text: 'text-orange-600   :text-orange-400', border: 'border-orange-200   :border-orange-800' },
  'in-progress': { bg: 'bg-cyan-50   :bg-cyan-950', text: 'text-cyan-600   :text-cyan-400', border: 'border-cyan-200   :border-cyan-800' },
};

const priorityConfig = {
  high: { bg: 'bg-red-50   :bg-red-950', text: 'text-red-600   :text-red-400', border: 'border-red-200   :border-red-800' },
  medium: { bg: 'bg-yellow-50   :bg-yellow-950', text: 'text-yellow-600   :text-yellow-400', border: 'border-yellow-200   :border-yellow-800' },
  low: { bg: 'bg-gray-50   :bg-gray-950', text: 'text-gray-600   :text-gray-400', border: 'border-gray-200   :border-gray-800' },
};

export default function CommunicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [taskAssigneeFilter, setTaskAssigneeFilter] = useState('all');
  const [calendarAssigneeFilter, setCalendarAssigneeFilter] = useState('all');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'meeting',
    assignee: '',
    meetLink: '',
    phone: '',
  });
  const [activitiesState, setActivitiesState] = useState(initialActivities);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setIsDayDetailsOpen(true);
  };

  const handleAddEventFromDayDetails = () => {
    setNewEvent({
      title: '',
      date: selectedDate || '',
      time: '',
      type: 'meeting',
      assignee: '',
      meetLink: '',
      phone: '',
    });
    setEditingEventId(null);
    setIsDayDetailsOpen(false);
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (activity: any) => {
    setNewEvent({
      title: activity.subject,
      date: activity.date.split('T')[0],
      time: new Date(activity.date).toTimeString().slice(0, 5),
      type: activity.type,
      assignee: activity.assignedTo,
      meetLink: activity.notes.startsWith('Link: ') ? activity.notes.replace('Link: ', '') : '',
      phone: activity.notes.startsWith('Phone: ') ? activity.notes.replace('Phone: ', '') : '',
    });
    setEditingEventId(activity.id);
    setIsDayDetailsOpen(false);
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = (id: number) => {
    setActivitiesState(activitiesState.filter(a => a.id !== id));
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const dateTime = newEvent.time ? `${newEvent.date}T${newEvent.time}:00` : `${newEvent.date}T00:00:00`;

    if (editingEventId) {
      // Update existing event
      setActivitiesState(activitiesState.map(a =>
        a.id === editingEventId ? {
          ...a,
          type: newEvent.type,
          subject: newEvent.title,
          assignedTo: newEvent.assignee || 'Unassigned',
          date: dateTime,
          notes: newEvent.type === 'meeting' ? `Link: ${newEvent.meetLink}` : `Phone: ${newEvent.phone}`,
        } : a
      ));
      setEditingEventId(null);
    } else {
      // Create new event
      const newActivity = {
        id: activitiesState.length + 1,
        type: newEvent.type,
        subject: newEvent.title,
        customer: 'New Customer',
        company: 'New Company',
        status: 'scheduled',
        priority: 'medium',
        assignedTo: newEvent.assignee || 'Unassigned',
        date: dateTime,
        notes: newEvent.type === 'meeting' ? `Link: ${newEvent.meetLink}` : `Phone: ${newEvent.phone}`,
      };
      setActivitiesState([...activitiesState, newActivity]);
    }

    setIsEventDialogOpen(false);
    // Re-open day details if we were on a specific day
    if (selectedDate) {
      setIsDayDetailsOpen(true);
    }

    setNewEvent({
      title: '',
      date: '',
      time: '',
      type: 'meeting',
      assignee: '',
      meetLink: '',
      phone: '',
    });
  };

  const filterByTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (timeFilter) {
      case 'today':
        return date >= startOfDay;
      case 'week':
        return date >= startOfWeek;
      case 'month':
        return date >= startOfMonth;
      default:
        return true;
    }
  };

  const filteredActivities = activitiesState.filter((activity) => {
    const matchesSearch =
      activity.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === 'all' || activity.type === selectedType;

    const matchesTime = filterByTime(activity.date);

    return matchesSearch && matchesType && matchesTime;
  });

  const filteredTasks = tasks.filter((task) => {
    return taskAssigneeFilter === 'all' || task.assignedTo === taskAssigneeFilter;
  });

  const calendarEvents = activitiesState.map(a => ({
    title: a.subject,
    date: a.date,
    backgroundColor: a.type === 'meeting' ? '#8b5cf6' : a.type === 'call' ? '#10b981' : '#3b82f6',
    borderColor: a.type === 'meeting' ? '#7c3aed' : a.type === 'call' ? '#059669' : '#2563eb',
    extendedProps: { type: a.type, assignee: a.assignedTo }
  })).filter(event => calendarAssigneeFilter === 'all' || event.extendedProps.assignee === calendarAssigneeFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900   dark:text-white mb-2">
            Communications
          </h1>
          <p className="text-slate-600   :text-slate-400">
            Manage customer interactions and team tasks
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
              <Plus className="w-4 h-4 mr-2" />
              New Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Activity</DialogTitle>
              <DialogDescription>
                Log a new communication or task
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Activity Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sarah Johnson</SelectItem>
                      <SelectItem value="2">Michael Chen</SelectItem>
                      <SelectItem value="3">Emma Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Activity subject..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes or details..."
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                Create Activity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-0 shadow-lg bg-white   :bg-slate-800 hover:shadow-xl transition-all duration-300 group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600   :text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900   dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList className="bg-white   :bg-slate-800 border border-slate-200   :border-slate-700 p-1">
          <TabsTrigger value="activities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white   :bg-slate-800">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle className="text-slate-900   :text-white">Activity Log</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActivities.map((activity) => {
                  const Icon = activityIcons[activity.type as keyof typeof activityIcons];
                  const statusStyle = statusConfig[activity.status as keyof typeof statusConfig];
                  const priorityStyle = priorityConfig[activity.priority as keyof typeof priorityConfig];

                  return (
                    <Card
                      key={activity.id}
                      className="border border-slate-200   :border-slate-700 hover:shadow-md transition-all duration-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg ${activity.type === 'email'
                              ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                              : activity.type === 'call'
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                : activity.type === 'meeting'
                                  ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                  : 'bg-gradient-to-br from-orange-500 to-red-500'
                              } flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-900   dark:text-white mb-1">
                                  {activity.subject}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600   dark:text-slate-400 mb-2">
                                  <span className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {activity.customer} - {activity.company}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(activity.date).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600   dark:text-slate-400">
                                  {activity.notes}
                                </p>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="ml-2">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                              >
                                {activity.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
                              >
                                {activity.priority} priority
                              </Badge>
                              <Badge variant="outline" className="bg-slate-50   dark:bg-slate-800 text-slate-600   dark:text-slate-400 border-slate-200   dark:border-slate-700">
                                Assigned to {activity.assignedTo}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white   dark:bg-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900 dark:text-white">Team Tasks</CardTitle>
                <Select value={taskAssigneeFilter} onValueChange={setTaskAssigneeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Users className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    <SelectItem value="Sarah Davis">Sarah Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTasks.map((task) => {
                  const statusStyle = statusConfig[task.status as keyof typeof statusConfig];
                  const priorityStyle = priorityConfig[task.priority as keyof typeof priorityConfig];

                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200   dark:border-slate-700 hover:bg-slate-50   dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-lg ${task.status === 'completed'
                            ? 'bg-green-100   dark:bg-green-950'
                            : task.status === 'in-progress'
                              ? 'bg-blue-100   dark:bg-blue-950'
                              : 'bg-orange-100   dark:bg-orange-950'
                            } flex items-center justify-center`}
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600   dark:text-green-400" />
                          ) : task.status === 'in-progress' ? (
                            <Clock className="w-5 h-5 text-blue-600   dark:text-blue-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-orange-600   dark:text-orange-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900   dark:text-white mb-1">
                            {task.title}
                          </h4>
                          <div className="flex items-center space-x-3 text-xs text-slate-500   dark:text-slate-400">
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {task.assignedTo}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={`${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
                        >
                          {task.priority}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {task.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Task</DropdownMenuItem>
                            <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900 dark:text-white">Calendar</CardTitle>
                <div className="flex items-center space-x-4">
                  <Select value={calendarAssigneeFilter} onValueChange={setCalendarAssigneeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Users className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Day Details Dialog */}
                  <Dialog open={isDayDetailsOpen} onOpenChange={setIsDayDetailsOpen}>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Day Details'}
                        </DialogTitle>
                        <DialogDescription>
                          Scheduled activities for this day
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        {activitiesState.filter(a => a.date.startsWith(selectedDate || '')).length === 0 ? (
                          <p className="text-center text-slate-500 py-4">No activities scheduled for this day.</p>
                        ) : (
                          <div className="space-y-3">
                            {activitiesState.filter(a => a.date.startsWith(selectedDate || '')).map(activity => (
                              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                <div>
                                  <h4 className="font-medium text-slate-900 dark:text-white">{activity.subject}</h4>
                                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    <ClockIcon className="w-3 h-3 mr-1" />
                                    {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    <span className="mx-2">•</span>
                                    {activity.type}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditEvent(activity)}>
                                    <Edit className="w-4 h-4 text-slate-500 hover:text-blue-500" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteEvent(activity.id)}>
                                    <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <Button className="w-full mt-4" onClick={handleAddEventFromDayDetails}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Activity
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingEventId ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                        <DialogDescription>Schedule a call or meeting</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Event Title</Label>
                          <Input
                            placeholder="Meeting with..."
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={newEvent.date}
                              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                              type="time"
                              value={newEvent.time}
                              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                              value={newEvent.type}
                              onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="meeting">Meeting</SelectItem>
                                <SelectItem value="call">Call</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Assignee</Label>
                            <Select
                              value={newEvent.assignee}
                              onValueChange={(v) => setNewEvent({ ...newEvent, assignee: v })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select assignee" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="John Doe">John Doe</SelectItem>
                                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                                <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {newEvent.type === 'meeting' && (
                          <div className="space-y-2">
                            <Label>Google Meet Link</Label>
                            <div className="relative">
                              <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                className="pl-10"
                                placeholder="meet.google.com/..."
                                value={newEvent.meetLink}
                                onChange={(e) => setNewEvent({ ...newEvent, meetLink: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                        {newEvent.type === 'call' && (
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                className="pl-10"
                                placeholder="+1 (555) 000-0000"
                                value={newEvent.phone}
                                onChange={(e) => setNewEvent({ ...newEvent, phone: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEvent}>{editingEventId ? 'Update Event' : 'Save Event'}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="calendar-wrapper">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={calendarEvents}
                  dateClick={handleDateClick}
                  height="auto"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  eventClassNames="cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div >
  );
}
