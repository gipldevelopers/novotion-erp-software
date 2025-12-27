// Updated: 2025-12-27
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Shield, User, Calculator, Briefcase, TrendingUp, CreditCard, Eye } from 'lucide-react';
const roles = [
    { value: 'admin', label: 'Administrator', description: 'Full access to all modules', icon: Shield },
    { value: 'manager', label: 'Manager', description: 'Manage operations across departments', icon: User },
    { value: 'accountant', label: 'Accountant', description: 'Access to accounting and reports', icon: Calculator },
    { value: 'hr', label: 'HR Manager', description: 'Manage employees and payroll', icon: Briefcase },
    { value: 'sales', label: 'Sales', description: 'CRM and customer management', icon: TrendingUp },
    { value: 'cashier', label: 'Cashier', description: 'POS and billing access', icon: CreditCard },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access', icon: Eye },
];
export default function LoginPage() {
    const [selectedRole, setSelectedRole] = useState('admin');
    const { login } = useAuthStore();
    const router = useRouter();
    const handleLogin = () => {
        login(selectedRole);
        router.push('/erp/dashboard');
    };
    return (<div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in">
            <CardHeader className="text-center">
                <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Novotion erp Login</CardTitle>
                <CardDescription>
                    Select a role to experience the system with different permission levels
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select Role</label>
                    <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (<SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                    <role.icon className="h-4 w-4" />
                                    <span>{role.label}</span>
                                </div>
                            </SelectItem>))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Role Description */}
                <div className="p-4 bg-muted rounded-lg">
                    {roles.find((r) => r.value === selectedRole) && (<div className="flex items-start gap-3">
                        {(() => {
                            const RoleIcon = roles.find((r) => r.value === selectedRole).icon;
                            return <RoleIcon className="h-5 w-5 text-primary mt-0.5" />;
                        })()}
                        <div>
                            <p className="font-medium">
                                {roles.find((r) => r.value === selectedRole)?.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {roles.find((r) => r.value === selectedRole)?.description}
                            </p>
                        </div>
                    </div>)}
                </div>

                <Button onClick={handleLogin} className="w-full" size="lg">
                    Login as {roles.find((r) => r.value === selectedRole)?.label}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    This is a demo login. In production, this would connect to your authentication system.
                </p>
            </CardContent>
        </Card>
    </div>);
}
