// Updated: 2025-12-27
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function EmployeeExit() {
    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> Offboarding Zone
                </CardTitle>
                <CardDescription>Manage employee resignation and termination.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    Initiating the offboarding process will trigger a series of tasks including asset recovery, exit interview scheduling, and account deactivation. This action should only be taken when an employee has formally resigned or is being terminated.
                </p>
                <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20">
                    <h4 className="font-semibold text-destructive mb-2">Danger Zone</h4>
                    <div className="flex gap-4">
                        <Button variant="destructive">Initiate Termination</Button>
                        <Button variant="outline" className="text-destructive hover:bg-destructive/10">Process Resignation</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
