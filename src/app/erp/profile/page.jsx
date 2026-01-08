'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Mail, Phone, MapPin, Building, Briefcase,
    Calendar, DollarSign, Shield, User,
    Edit, Save, X, Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function UnifiedProfilePage() {
    const { user, checkAuth } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (user?.employee) {
            setFormData({
                firstName: user.employee.firstName || '',
                lastName: user.employee.lastName || '',
                phone: user.employee.phone || '',
                address: user.employee.address || '',
            });
        }
    }, [user]);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const employee = user.employee || {};

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5050/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${useAuthStore.getState().token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Profile updated successfully');
                await checkAuth(); // Refresh user data in store
                setIsEditing(false);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8 animate-in fade-in duration-500">
            {/* Header / Cover Area */}
            <div className="relative h-48 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/5 to-background border border-primary/10 overflow-hidden shadow-sm">
                <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl rounded-2xl ring-4 ring-primary/5">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-bold">
                            {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="mb-14 space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            {employee.firstName} {employee.lastName}
                        </h1>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary px-3 py-1 font-semibold rounded-lg">
                                {user.role?.toUpperCase()}
                            </Badge>
                            <span className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                                <Building className="h-4 w-4" /> {employee.department || 'General'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                {/* Left Column: Quick Stats & Info */}
                <div className="space-y-6">
                    <Card className="border-primary/10 shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm bg-card/50">
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" /> Role Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Designation</span>
                                <span className="font-bold text-foreground">{employee.designation || 'N/A'}</span>
                            </div>
                            <Separator className="bg-primary/5" />
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Status</span>
                                <Badge className={employee.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3' : ''}>
                                    {employee.status}
                                </Badge>
                            </div>
                            <Separator className="bg-primary/5" />
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Emp ID</span>
                                <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{employee.id || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/10 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" /> Employment Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4 text-sm font-medium">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>Joined: {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <span>Salary: ${employee.salary?.toLocaleString() || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Information Forms */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-primary/10 shadow-md rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-primary/5">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" /> Personal Details
                                </CardTitle>
                                <CardDescription>Update your personal information below</CardDescription>
                            </div>
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="rounded-lg font-semibold hover:bg-primary/5 border-primary/20">
                                    <Edit className="h-4 w-4 mr-2" /> Edit Info
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="rounded-lg">
                                        <X className="h-4 w-4 mr-1" /> Cancel
                                    </Button>
                                    <Button onClick={handleSave} size="sm" className="rounded-lg bg-primary shadow-lg shadow-primary/20" disabled={loading}>
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold tracking-wide uppercase text-muted-foreground/70">First Name</label>
                                    <Input
                                        disabled={!isEditing}
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="h-11 bg-muted/20 border-muted/60 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold tracking-wide uppercase text-muted-foreground/70">Last Name</label>
                                    <Input
                                        disabled={!isEditing}
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="h-11 bg-muted/20 border-muted/60 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold tracking-wide uppercase text-muted-foreground/70">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/60" />
                                        <Input disabled value={user.email} className="pl-10 h-11 bg-muted/20 border-muted/60" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium px-1">Email cannot be changed by the user.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold tracking-wide uppercase text-muted-foreground/70">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/60" />
                                        <Input
                                            disabled={!isEditing}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="pl-10 h-11 bg-muted/20 border-muted/60 font-medium"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold tracking-wide uppercase text-muted-foreground/70">Mailing Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/60" />
                                    <Input
                                        disabled={!isEditing}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="pl-10 h-11 bg-muted/20 border-muted/60 font-medium"
                                        placeholder="123 Street Name, City, Country"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/10 shadow-sm rounded-2xl border-dashed bg-muted/5 font-medium">
                        <CardContent className="p-8 text-center space-y-2">
                            <p className="text-muted-foreground">More profile features (security settings, activity logs, etc.) coming soon.</p>
                            <p className="text-xs text-primary/60">Novotion ERP v1.0.0-beta</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
