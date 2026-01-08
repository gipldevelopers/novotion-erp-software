'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users, UserCheck, UserX, Clock, Search,
    Shield, Mail, Calendar, Loader2, MoreVertical,
    CheckCircle, XCircle, Trash2, Edit3, Eye,
    Activity, ArrowUpRight, History
} from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

export default function UserManagementPage() {
    const { token, user: currentUser } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // UI States
    const [selectedUser, setSelectedUser] = useState(null);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [isActivitySheetOpen, setIsActivitySheetOpen] = useState(false);
    const [newRoleId, setNewRoleId] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5050/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:5050/api/admin/roles', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setRoles(data.roles);
            }
        } catch (error) {
            console.error('Failed to load roles');
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleApprove = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5050/api/admin/users/${userId}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roleName: 'employee' })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('User approved successfully');
                fetchUsers();
            }
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    const handleUpdateRole = async () => {
        if (!newRoleId) return;
        setIsActionLoading(true);
        try {
            const response = await fetch(`http://localhost:5050/api/admin/users/${selectedUser.id}/role`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roleId: newRoleId })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('User role updated');
                fetchUsers();
                setIsRoleDialogOpen(false);
            }
        } catch (error) {
            toast.error('Role update failed');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (userId === currentUser.id) return toast.error("Cannot delete yourself");
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await fetch(`http://localhost:5050/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                toast.success('User deleted');
                fetchUsers();
            }
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());

        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'pending') return matchesSearch && u.status === 'Pending';
        if (activeTab === 'active') return matchesSearch && u.status === 'Active';
        return matchesSearch;
    });

    const pendingCount = users.filter(u => u.status === 'Pending').length;

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" /> User Management
                    </h1>
                    <p className="text-muted-foreground font-medium italic">
                        Control system access, assign roles, and audit user activity
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Find user by name or email..."
                            className="h-11 pl-10 bg-card/50 border-primary/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="all" className="px-6 h-9 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            All Users
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="px-6 h-9 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2">
                            Pending Requests
                            {pendingCount > 0 && <Badge variant="destructive" className="h-5 min-w-[20px] px-1 animate-pulse">{pendingCount}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="active" className="px-6 h-9 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            Active
                        </TabsTrigger>
                    </TabsList>

                    <Button variant="outline" className="border-primary/20 hover:bg-primary/5 font-bold" onClick={fetchUsers}>
                        Refresh Data
                    </Button>
                </div>

                <TabsContent value={activeTab}>
                    <Card className="border-primary/10 shadow-lg overflow-hidden backdrop-blur-sm bg-card/80">
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-20 text-center space-y-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                                    <p className="font-bold text-muted-foreground">Syncing user directory...</p>
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="p-20 text-center space-y-4">
                                    <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                                        <Users className="h-10 w-10 text-muted-foreground/30" />
                                    </div>
                                    <p className="font-bold text-muted-foreground italic">No users found matching your criteria.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-muted/30 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                            <tr>
                                                <th className="px-6 py-4">User Details</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Role</th>
                                                <th className="px-6 py-4">Last Activity</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/5">
                                            {filteredUsers.map((u) => (
                                                <tr key={u.id} className="hover:bg-primary/5 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                                {u.name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-foreground leading-none mb-1 group-hover:text-primary transition-colors">{u.name || 'Incognito User'}</p>
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <Mail className="h-3 w-3" /> {u.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge
                                                            variant={u.status === 'Active' ? 'success' : u.status === 'Pending' ? 'warning' : 'destructive'}
                                                            className="font-black px-2.5 py-0.5 rounded-lg border-none"
                                                        >
                                                            {u.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Shield className="h-4 w-4 text-primary/60" />
                                                            {u.role?.name || 'No Role Assigned'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                                                        {u.lastLogin ? (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3 text-emerald-500" />
                                                                {new Date(u.lastLogin).toLocaleString(undefined, {
                                                                    dateStyle: 'short',
                                                                    timeStyle: 'short'
                                                                })}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground/40 italic">Never logged in</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {u.status === 'Pending' ? (
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-emerald-500 hover:bg-emerald-600 font-bold px-4 h-8"
                                                                    onClick={() => handleApprove(u.id)}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-destructive hover:bg-destructive/10 font-bold h-8"
                                                                    onClick={() => handleReject(u.id)}
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-2" /> Reject
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-full h-8 w-8">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-56 p-2 font-bold bg-card border-primary/20 shadow-2xl">
                                                                    <DropdownMenuLabel className="px-2 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">User Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem className="rounded-lg cursor-pointer" onSelect={() => {
                                                                        setSelectedUser(u);
                                                                        setTimeout(() => setIsActivitySheetOpen(true), 100);
                                                                    }}>
                                                                        <Eye className="mr-2 h-4 w-4 text-primary" /> View Activity
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="rounded-lg cursor-pointer" onSelect={() => {
                                                                        setSelectedUser(u);
                                                                        setNewRoleId(u.roleId || '');
                                                                        setTimeout(() => setIsRoleDialogOpen(true), 100);
                                                                    }}>
                                                                        <Edit3 className="mr-2 h-4 w-4 text-amber-500" /> Change Role
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-primary/10" />
                                                                    <DropdownMenuItem
                                                                        className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                                                        onSelect={() => {
                                                                            handleDeleteUser(u.id);
                                                                        }}
                                                                        disabled={u.id === currentUser.id}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Role Update Dialog */}
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent className="sm:max-w-md border-primary/20 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Shield className="h-5 w-5 text-amber-500" /> Update User Role
                        </DialogTitle>
                        <DialogDescription className="font-medium">
                            Set a new authorization level for <strong>{selectedUser?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Select Permission Level</label>
                            <Select value={newRoleId} onValueChange={setNewRoleId}>
                                <SelectTrigger className="h-12 border-primary/20 bg-muted/30 font-bold">
                                    <SelectValue placeholder="Choose a role" />
                                </SelectTrigger>
                                <SelectContent className="font-bold border-primary/20">
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.id} className="cursor-pointer">
                                            {role.name.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                            <p className="text-xs text-amber-700 font-medium">
                                Updating a user's role will immediately change their access to ERP modules. This action takes effect upon their next navigation click.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRoleDialogOpen(false)} className="font-bold">Cancel</Button>
                        <Button className="bg-primary font-bold shadow-lg shadow-primary/20" onClick={handleUpdateRole} disabled={isActionLoading}>
                            {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
                            Apply Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* User Activity Sheet */}
            <Sheet open={isActivitySheetOpen} onOpenChange={setIsActivitySheetOpen}>
                <SheetContent className="w-[400px] sm:w-[540px] border-l-primary/10">
                    <SheetHeader className="pb-8 border-b border-primary/10">
                        <SheetTitle className="text-2xl font-black flex items-center gap-3">
                            <Activity className="h-6 w-6 text-primary" /> User Activity
                        </SheetTitle>
                        <SheetDescription className="font-semibold text-base">
                            Audit trail for <strong>{selectedUser?.name}</strong>
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-8 space-y-8 overflow-y-auto h-[calc(100vh-200px)]">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Status</p>
                                <p className="text-lg font-black text-primary">{selectedUser?.status}</p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-2xl border border-border space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Account Age</p>
                                <p className="text-lg font-black">{Math.floor((new Date() - new Date(selectedUser?.createdAt)) / (1000 * 60 * 60 * 24))} Days</p>
                            </div>
                        </div>

                        {/* Activity Timeline (Mocking recent events as the schema doesn't store full logs yet) */}
                        <div className="space-y-6">
                            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <History className="h-4 w-4 text-primary" /> Recent Events
                            </h3>

                            <div className="space-y-6 pl-4 border-l-2 border-primary/10">
                                {selectedUser?.lastLogin && (
                                    <div className="relative">
                                        <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold flex items-center justify-between">
                                                User Login <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">Success</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground font-medium">System authentication via Web Portal</p>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase pt-1">{new Date(selectedUser.lastLogin).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="relative">
                                    <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-primary/40" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">Profile Update</p>
                                        <p className="text-xs text-muted-foreground font-medium">Contact information modified</p>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase pt-1">2 hours ago</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-primary/40" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold flex items-center justify-between">
                                            Resource View <ArrowUpRight className="h-3 w-3 text-primary" />
                                        </p>
                                        <p className="text-xs text-muted-foreground font-medium">Accessed HRMS Leave Dashboard</p>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase pt-1">Yesterday, 4:15 PM</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-amber-500/50" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">Password Change</p>
                                        <p className="text-xs text-muted-foreground font-medium">Security credential updated</p>
                                        <p className="text-[10px] font-black text-amber-600 uppercase pt-1">3 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
