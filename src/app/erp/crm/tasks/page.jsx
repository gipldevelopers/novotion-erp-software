'use client';

import React, { useEffect, useState } from 'react';
import { crmService } from '@/services/crmService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await crmService.getTasks();
                setTasks(data);
            } catch (error) {
                console.error('Failed to fetch tasks', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div className="space-y-6 p-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
                <p className="text-muted-foreground">Manage your to-do list and priorities.</p>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-8">Loading tasks...</div>
                ) : (
                    tasks.map((task) => (
                        <Card key={task.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button className="text-muted-foreground hover:text-primary">
                                        {task.status === 'Completed' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5" />}
                                    </button>
                                    <div>
                                        <h4 className={cn("font-medium", task.status === 'Completed' && "line-through text-muted-foreground")}>
                                            {task.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>Assigned to: {task.assignedTo}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant={
                                    task.priority === 'High' ? 'destructive' :
                                        task.priority === 'Medium' ? 'default' : 'secondary'
                                }>
                                    {task.priority}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
