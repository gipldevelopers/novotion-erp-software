// Updated: 2026-01-08
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);

            // Redirect based on role
            if (user.role === 'employee' || user.role === 'hr') {
                router.push('/erp/hrms/me/dashboard');
            } else if (user.role === 'manager') {
                router.push('/erp/hrms/manager/dashboard');
            } else {
                router.push('/erp/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-fade-in border-primary/10 shadow-xl backdrop-blur-sm bg-card/80">
                <CardHeader className="text-center space-y-1">
                    <div className="h-16 w-16 bg-gradient-to-tr from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3 transition-transform hover:rotate-0">
                        <Shield className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">Novotion ERP</CardTitle>
                    <CardDescription className="text-base">
                        Sign in to access your enterprise dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/70">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="admin@erp.com"
                                    className="pl-10 h-11 border-muted/60 focus:border-primary/50 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/70">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 h-11 border-muted/60 focus:border-primary/50 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-muted text-primary focus:ring-primary h-4 w-4" />
                                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="font-medium text-primary hover:underline underline-offset-4">Forgot password?</a>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <div className="text-center pt-2">
                            <p className="text-sm text-muted-foreground">
                                Don't have access?{' '}
                                <Link href="/register" className="text-primary hover:underline font-bold">
                                    Request Account
                                </Link>
                            </p>
                        </div>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground font-medium tracking-widest">Demo Credentials</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground font-medium">
                            <div className="p-2 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => { setEmail('admin@erp.com'); setPassword('password123'); }}>
                                <span className="text-primary block group-hover:font-bold transition-all">ADMIN</span>
                                admin@erp.com
                            </div>
                            <div className="p-2 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => { setEmail('hr@erp.com'); setPassword('password123'); }}>
                                <span className="text-primary block group-hover:font-bold transition-all">HR</span>
                                hr@erp.com
                            </div>
                            <div className="p-2 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => { setEmail('accountant@erp.com'); setPassword('password123'); }}>
                                <span className="text-primary block group-hover:font-bold transition-all">ACCOUNTANT</span>
                                accountant@erp.com
                            </div>
                            <div className="p-2 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => { setEmail('cashier@erp.com'); setPassword('password123'); }}>
                                <span className="text-primary block group-hover:font-bold transition-all">CASHIER</span>
                                cashier@erp.com
                            </div>
                            <div className="p-2 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => { setEmail('sales1@erp.com'); setPassword('password123'); }}>
                                <span className="text-primary block group-hover:font-bold transition-all">SALES</span>
                                sales1@erp.com
                            </div>
                            <div className="p-2 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => { setEmail('employee1@erp.com'); setPassword('password123'); }}>
                                <span className="text-primary block group-hover:font-bold transition-all">EMPLOYEE</span>
                                employee1@erp.com
                            </div>
                        </div>
                    </form>

                    <p className="text-xs text-center text-muted-foreground mt-8 italic">
                        Secured by Novotion Enterprise Security System
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
