'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, TrendingUp } from 'lucide-react';

export default function EmployeePerformance({ performance }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center">
                            4.5 <Star className="ml-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Reviews</CardTitle>
                    <CardDescription>Quarterly and annual evaluations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {performance.map((review) => (
                            <div key={review.id} className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 font-bold">
                                    {review.rating}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-lg">{review.reviewPeriod} Review</h4>
                                    <div className="text-sm text-muted-foreground">Reviewed by <span className="font-medium text-foreground">{review.reviewer}</span> on {review.date}</div>
                                    <p className="text-sm text-muted-foreground mt-2 bg-muted p-3 rounded-md italic">"{review.comments}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
