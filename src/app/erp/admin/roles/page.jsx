'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    ShieldCheck, Loader2, Save, 
    ChevronRight, Settings2, Users,
    Search, Filter, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function RolesManagementPage() {
    const { token } = useAuthStore();
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rolesRes, permsRes] = await Promise.all([
                fetch('http://localhost:5050/api/admin/roles', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5050/api/admin/permissions', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const rolesData = await rolesRes.json();
            const permsData = await permsRes.json();

            if (rolesData.success) {
                setRoles(rolesData.roles);
                if (rolesData.roles.length > 0) {
                    fetchRoleDetails(rolesData.roles[0].id);
                }
            }
            if (permsData.success) setPermissions(permsData.permissions);
            
        } catch (error) {
            toast.error('Failed to load RBAC data');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoleDetails = async (roleId) => {
        try {
            const response = await fetch(`http://localhost:5050/api/admin/roles/${roleId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setSelectedRole(data.role);
                setRolePermissions(data.role.permissions.map(p => p.permissionId));
            }
        } catch (error) {
            toast.error('Failed to load role details');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTogglePermission = (permId) => {
        setRolePermissions(prev => 
            prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
        );
    };

    const handleSavePermissions = async () => {
        setSaving(true);
        try {
            const response = await fetch(`http://localhost:5050/api/admin/roles/${selectedRole.id}/permissions`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ permissionIds: rolePermissions })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Permissions deployed successfully');
            }
        } catch (error) {
            toast.error('Failed to save permissions');
        } finally {
            setSaving(false);
        }
    };

    // Group permissions by resource for the table view
    const groupedPermissions = permissions.reduce((acc, perm) => {
        if (!acc[perm.resource]) acc[perm.resource] = [];
        acc[perm.resource].push(perm);
        return acc;
    }, {});

    const filteredResources = Object.keys(groupedPermissions).filter(resource => 
        resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        groupedPermissions[resource].some(p => p.action.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-bold text-muted-foreground">Synchronizing Security Matrix...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/40 p-6 rounded-2xl border border-primary/10 backdrop-blur-sm">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        Global Access Control
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                         Precision Role-Based Permission Management System
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input 
                            placeholder="Filter resources..." 
                            className="pl-9 h-10 border-primary/10 bg-background/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                         />
                    </div>
                    <Button 
                        size="md" 
                        className="h-10 px-6 font-bold shadow-lg shadow-primary/20 gap-2"
                        onClick={handleSavePermissions}
                        disabled={saving || !selectedRole}
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Apply Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Roles Selector (Compact) */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <Card className="border-primary/10 shadow-sm border-none bg-muted/30">
                        <CardHeader className="p-4 pb-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Users className="h-3 w-3" /> Select Role
                             </span>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1">
                            {roles.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => fetchRoleDetails(role.id)}
                                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all ${
                                        selectedRole?.id === role.id 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'hover:bg-primary/5 text-foreground'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs ${
                                            selectedRole?.id === role.id ? 'bg-white/20' : 'bg-primary/10 text-primary'
                                        }`}>
                                            {role.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="truncate">
                                            <p className="font-bold text-sm truncate">{role.name}</p>
                                        </div>
                                    </div>
                                    {selectedRole?.id === role.id && <ChevronRight className="h-4 w-4" />}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                         <div className="flex items-center gap-2 text-primary">
                            <Info className="h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-tight">Pro Tip</span>
                         </div>
                         <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                            Changes made to the permission matrix are applied globally to all users assigned to the selected role.
                         </p>
                    </div>
                </div>

                {/* Table-Wise Permission Matrix */}
                <div className="col-span-12 lg:col-span-9">
                    <Card className="border-primary/10 shadow-xl overflow-hidden bg-card/60 backdrop-blur-md">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-muted/50 border-b border-primary/10">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-1/3">Resource / Module</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capabilities & Actions</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center w-24">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5">
                                    {filteredResources.length > 0 ? filteredResources.map(resource => (
                                        <tr key={resource} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-6 py-5 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-black text-sm uppercase tracking-tight text-primary flex items-center gap-2">
                                                        <Settings2 className="h-3.5 w-3.5 opacity-50" />
                                                        {resource}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground font-bold">System components related to {resource}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {groupedPermissions[resource].map(perm => (
                                                        <div 
                                                            key={perm.id}
                                                            onClick={() => handleTogglePermission(perm.id)}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all ${
                                                                rolePermissions.includes(perm.id)
                                                                ? 'border-primary/40 bg-primary/10 text-primary scale-[1.03]'
                                                                : 'border-transparent bg-muted/50 text-muted-foreground hover:bg-muted/80'
                                                            }`}
                                                        >
                                                            <Checkbox 
                                                                checked={rolePermissions.includes(perm.id)}
                                                                onCheckedChange={() => handleTogglePermission(perm.id)}
                                                                className="h-3 w-3 data-[state=checked]:bg-primary data-[state=checked]:border-primary border-primary/20"
                                                            />
                                                            <span className="text-[11px] font-black uppercase tracking-tight">{perm.action}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Badge variant="outline" className="font-black text-[10px] uppercase tracking-tighter bg-background/50">
                                                    {groupedPermissions[resource].filter(p => rolePermissions.includes(p.id)).length} / {groupedPermissions[resource].length}
                                                </Badge>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-30">
                                                    <Filter className="h-10 w-10" />
                                                    <p className="font-black italic">No resources found matching filter</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    
                    <div className="mt-4 flex justify-between items-center px-2">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-primary" />
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Enabled</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-muted border border-primary/20" />
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Disabled</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground italic">
                            Currently editing: <span className="text-primary font-black uppercase">{selectedRole?.name}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
