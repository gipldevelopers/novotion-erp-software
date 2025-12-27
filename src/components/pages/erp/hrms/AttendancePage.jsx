import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mockAttendance = [
    { date: 1, status: 'present' }, { date: 2, status: 'present' }, { date: 3, status: 'present' }, { date: 4, status: 'absent' }, { date: 5, status: 'present' },
    { date: 6, status: 'weekend' }, { date: 7, status: 'weekend' }, { date: 8, status: 'present' }, { date: 9, status: 'late' }, { date: 10, status: 'present' },
    { date: 11, status: 'present' }, { date: 12, status: 'present' }, { date: 13, status: 'weekend' }, { date: 14, status: 'weekend' }, { date: 15, status: 'present' },
];
const statusColors = { present: 'bg-success', absent: 'bg-destructive', late: 'bg-warning', weekend: 'bg-muted', holiday: 'bg-info' };
export const AttendancePage = () => {
    return (<div className="space-y-6 animate-fade-in">
      <div className="page-header"><h1 className="page-title">Attendance</h1><p className="page-description">Track employee attendance</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Present Today</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-success">42</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Absent</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-destructive">3</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">On Leave</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-warning">5</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Employees</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">50</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>January 2024</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-2">{days.map(d => <div key={d} className="text-center text-sm font-medium text-muted-foreground">{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-2">
            {mockAttendance.map((day) => (<div key={day.date} className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium ${statusColors[day.status]} ${day.status !== 'weekend' ? 'text-white' : 'text-muted-foreground'}`}>{day.date}</div>))}
          </div>
          <div className="flex gap-4 mt-4">{Object.entries(statusColors).map(([status, color]) => <div key={status} className="flex items-center gap-2"><div className={`h-3 w-3 rounded ${color}`}/><span className="text-sm capitalize">{status}</span></div>)}</div>
        </CardContent>
      </Card>
    </div>);
};
