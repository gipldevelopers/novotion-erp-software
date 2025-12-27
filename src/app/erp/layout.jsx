'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ERPLayout } from '@/components/erp/ERPLayout';
export default function Layout({ children }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push('/login');
        }
    }, [mounted, isAuthenticated, router]);
    if (!mounted)
        return null; // Prevent hydration mismatch or flash of content
    if (!isAuthenticated)
        return null;
    return <ERPLayout>{children}</ERPLayout>;
}
