'use client';

import { useRouter } from 'next/navigation';
import { useHRMSRole } from '@/hooks/useHRMSRole';
import { Button } from '@/components/ui/button';
import { Users, Link as LinkIcon } from 'lucide-react';

export function EmployeeProfileGuard({ children }) {
    const router = useRouter();
    const { employeeId, isHRAdmin } = useHRMSRole();

    return (
        <>
            {!employeeId && (
                <div className="mx-8 mt-6">
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                                <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-900 dark:text-amber-100">Account Not Linked</h3>
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                    Your user account is not linked to an employee profile yet.
                                    {isHRAdmin ? ' Link your account to access personal features.' : ' Contact your Admin to link your profile.'}
                                </p>
                            </div>
                        </div>
                        {isHRAdmin && (
                            <Button
                                onClick={() => router.push('/erp/admin/employee-linking')}
                                size="sm"
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Manage Linking
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {children}
        </>
    );
}
