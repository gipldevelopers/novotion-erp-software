'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { User, Mail, Lock, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords don't match");
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5050/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    roleName: 'employee', // Default role
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIsSubmitted(true);
                toast.success('Registration request sent!');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-primary/20 shadow-2xl animate-in zoom-in duration-300">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-primary animate-bounce" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Request Submitted!</CardTitle>
                        <CardDescription className="text-base">
                            Your registration for <strong>{formData.name}</strong> has been received and is currently <strong>pending approval</strong> from our administration team.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="bg-muted/30 rounded-lg mx-6 p-4 mb-6">
                        <p className="text-sm text-center text-muted-foreground">
                            You will be able to log in to the Novotion ERP once an administrator activates your account. An email notification will be sent (future feature).
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline" onClick={() => router.push('/login')}>
                            Return to Login
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-primary/10 shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/login')} className="-ml-2 text-muted-foreground">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Login
                        </Button>
                        <div className="text-right">
                            <span className="text-xl font-bold text-primary">Novotion</span>
                            <span className="text-xs block text-muted-foreground font-medium uppercase tracking-tighter -mt-1">ERP Enterprise</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold mt-4">Create Account</CardTitle>
                    <CardDescription>
                        Fill in your details to request access to the Novotion ERP system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    name="name"
                                    placeholder="John Doe"
                                    className="pl-10 h-11 bg-muted/20 border-muted-foreground/20 focus:border-primary/50 transition-all font-medium"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    className="pl-10 h-11 bg-muted/20 border-muted-foreground/20 focus:border-primary/50 transition-all font-medium"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-11 bg-muted/20 border-muted-foreground/20 focus:border-primary/50 transition-all"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Confirm</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-11 bg-muted/20 border-muted-foreground/20 focus:border-primary/50 transition-all"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 group" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                "Request Registration"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Already have access?</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full h-11 font-semibold" onClick={() => router.push('/login')}>
                        Sign In Now
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
