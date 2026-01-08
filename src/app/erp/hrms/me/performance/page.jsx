'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { useHRMSRole } from '@/hooks/useHRMSRole';
import { EmployeeProfileGuard } from '@/components/hrms/EmployeeProfileGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Award, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyPerformancePage() {
    const router = useRouter();
    const { employeeId } = useHRMSRole();
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (employeeId) {
            loadPerformance();
        } else {
            setLoading(false);
        }
    }, [employeeId]);

    const loadPerformance = async () => {
        try {
            const allReviews = await hrmsService.getPerformanceReviews();
            const myReviews = allReviews.filter(r => r.employeeId === employeeId);
            setPerformanceData(myReviews);
        } catch (error) {
            console.error('Failed to load performance:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    const latestReview = performanceData[0];
    const avgRating = performanceData.length > 0
        ? performanceData.reduce((sum, r) => sum + r.rating, 0) / performanceData.length
        : 0;

    // Mock goals data
    const goals = [
        { id: 1, title: 'Complete Project Alpha', progress: 75, target: 100, status: 'In Progress' },
        { id: 2, title: 'Improve Code Quality', progress: 60, target: 100, status: 'In Progress' },
        { id: 3, title: 'Team Collaboration', progress: 90, target: 100, status: 'On Track' },
        { id: 4, title: 'Learning New Technology', progress: 40, target: 100, status: 'Behind' },
    ];

    return (
        <EmployeeProfileGuard>
            <div className="p-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Performance</h1>
                    <p className="text-muted-foreground mt-1">
                        Track your performance reviews and goals
                    </p>
                </div>

                {/* Performance Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Latest Rating
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <div className="text-3xl font-bold text-yellow-600">
                                    {latestReview ? latestReview.rating.toFixed(1) : 'N/A'}
                                </div>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${star <= (latestReview?.rating || 0)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {latestReview ? `Review: ${latestReview.reviewPeriod}` : 'No reviews yet'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Average Rating
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">
                                {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Based on {performanceData.length} reviews
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Goals Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                                {Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {goals.filter(g => g.progress >= 100).length} of {goals.length} completed
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Goals Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            My Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {goals.map((goal) => (
                                <div key={goal.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">{goal.title}</div>
                                        <Badge
                                            variant={
                                                goal.status === 'On Track' ? 'default' :
                                                    goal.status === 'Behind' ? 'destructive' :
                                                        'secondary'
                                            }
                                        >
                                            {goal.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <Progress value={goal.progress} className="h-2" />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{goal.progress}% complete</span>
                                            <span>Target: {goal.target}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Reviews */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Performance Reviews
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {performanceData.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No performance reviews yet</p>
                                </div>
                            ) : (
                                performanceData.map((review) => (
                                    <Card key={review.id} className="border-2">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="font-semibold">{review.reviewPeriod}</div>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                            <span className="font-bold text-yellow-600">{review.rating}</span>
                                                        </div>
                                                    </div>
                                                    {review.comments && (
                                                        <p className="text-sm text-muted-foreground italic">
                                                            "{review.comments}"
                                                        </p>
                                                    )}
                                                    <div className="text-xs text-muted-foreground mt-2">
                                                        Reviewed on {new Date(review.reviewDate || review.reviewPeriod).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={review.rating >= 4 ? 'default' : review.rating >= 3 ? 'secondary' : 'destructive'}
                                                    className="ml-4"
                                                >
                                                    {review.rating >= 4 ? 'Excellent' : review.rating >= 3 ? 'Good' : 'Needs Improvement'}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </EmployeeProfileGuard>
    );
}
