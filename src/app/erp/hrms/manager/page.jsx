'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/erp/hrms/manager/dashboard');
    }, [router]);

    return (
        <div className="p-8">
            <div className="flex items-center justify-center h-64">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        </div>
    );
}
