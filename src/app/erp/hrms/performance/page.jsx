'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
    Star,
    TrendingUp,
    Target,
    Award,
    Users,
    Plus,
    CheckCircle,
    Clock,
    MessageSquare,
    BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

export default function PerformancePage() {
    const [reviews, setReviews] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
    const [reviewData, setReviewData] = useState({
        employeeId: '',
        reviewPeriod: '',
        rating: 3,
        comments: '',
        strengths: '',
        improvements: '',
        goals: ''
    });

    // Mock goals data
    const [goals, setGoals] = useState([
        { id: 1, employeeId: 'EMP-101', title: 'Complete Project Alpha', progress: 75, target: 100, deadline: '2024-12-31', status: 'In Progress' },
        { id: 2, employeeId: 'EMP-101', title: 'Improve Code Quality', progress: 60, target: 100, deadline: '2024-11-30', status: 'In Progress' },
        { id: 3, employeeId: 'EMP-102', title: 'Team Leadership', progress: 90, target: 100, deadline: '2024-12-15', status: 'On Track' },
        { id: 4, employeeId: 'EMP-103', title: 'Sales Target Achievement', progress: 40, target: 100, deadline: '2024-12-31', status: 'Behind' },
        { id: 5, employeeId: 'EMP-104', title: 'Customer Satisfaction', progress: 100, target: 100, deadline: '2024-10-31', status: 'Completed' },
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [reviewsData, employeesData] = await Promise.all([
                hrmsService.getPerformanceReviews(),
                hrmsService.getEmployees()
            ]);
            setReviews(reviewsData);
            setEmployees(employeesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await hrmsService.createPerformanceReview(reviewData);
            toast.success('Performance review submitted successfully');
            setIsReviewDialogOpen(false);
            setReviewData({
                employeeId: '',
                reviewPeriod: '',
                rating: 3,
                comments: '',
                strengths: '',
                improvements: '',
                goals: ''
            });
            fetchData();
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : employeeId;
    };

    // Calculate stats
    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length
    }));

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'Completed').length;
    const inProgressGoals = goals.filter(g => g.status === 'In Progress').length;
    const behindGoals = goals.filter(g => g.status === 'Behind').length;

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Performance Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Track reviews, goals, and employee development
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsGoalDialogOpen(true)}>
                        <Target className="h-4 w-4 mr-2" />
                        Set Goal
                    </Button>
                    <Button onClick={() => setIsReviewDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Review
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Average Rating
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold text-yellow-600">
                                {avgRating.toFixed(1)}
                            </div>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-5 w-5 ${star <= avgRating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Based on {reviews.length} reviews
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalGoals}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {completedGoals} completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            In Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{inProgressGoals}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active goals</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Behind Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">{behindGoals}</div>
                        <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="reviews" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="reviews">
                        <Star className="h-4 w-4 mr-2" />
                        Reviews
                    </TabsTrigger>
                    <TabsTrigger value="goals">
                        <Target className="h-4 w-4 mr-2" />
                        Goals & KPIs
                    </TabsTrigger>
                    <TabsTrigger value="distribution">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Rating Distribution
                    </TabsTrigger>
                    <TabsTrigger value="feedback">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        360° Feedback
                    </TabsTrigger>
                </TabsList>

                {/* Reviews Tab */}
                <TabsContent value="reviews">
                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No performance reviews yet</p>
                                </CardContent>
                            </Card>
                        ) : (
                            reviews.map(review => (
                                <Card key={review.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-lg">
                                                        {getEmployeeName(review.employeeId)}
                                                    </span>
                                                    <Badge variant="outline">{review.reviewPeriod}</Badge>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-bold text-yellow-600">{review.rating}</span>
                                                    </div>
                                                </div>

                                                {review.comments && (
                                                    <div className="p-3 bg-muted rounded-lg">
                                                        <p className="text-sm italic">"{review.comments}"</p>
                                                    </div>
                                                )}

                                                <div className="grid gap-3 md:grid-cols-2">
                                                    {review.strengths && (
                                                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                            <div className="text-xs font-semibold text-green-700 mb-1">
                                                                Strengths
                                                            </div>
                                                            <p className="text-sm text-green-900">{review.strengths}</p>
                                                        </div>
                                                    )}
                                                    {review.improvements && (
                                                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                                            <div className="text-xs font-semibold text-orange-700 mb-1">
                                                                Areas for Improvement
                                                            </div>
                                                            <p className="text-sm text-orange-900">{review.improvements}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    Reviewed on {new Date(review.date || review.reviewPeriod).toLocaleDateString()}
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
                </TabsContent>

                {/* Goals Tab */}
                <TabsContent value="goals">
                    <div className="space-y-4">
                        {goals.map(goal => (
                            <Card key={goal.id}>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="font-semibold text-lg">{goal.title}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {getEmployeeName(goal.employeeId)} • Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    goal.status === 'Completed' ? 'default' :
                                                        goal.status === 'On Track' ? 'default' :
                                                            goal.status === 'Behind' ? 'destructive' :
                                                                'secondary'
                                                }
                                            >
                                                {goal.status === 'Completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                {goal.status === 'In Progress' && <Clock className="h-3 w-3 mr-1" />}
                                                {goal.status}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Progress</span>
                                                <span className="font-medium">{goal.progress}% of {goal.target}%</span>
                                            </div>
                                            <Progress value={goal.progress} className="h-2" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Rating Distribution Tab */}
                <TabsContent value="distribution">
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Rating Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {ratingDistribution.map(({ rating, count }) => (
                                    <div key={rating} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="font-medium">{rating} Stars</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-muted-foreground">{count} reviews</span>
                                                <span className="text-sm font-medium min-w-[50px] text-right">
                                                    {reviews.length > 0 ? ((count / reviews.length) * 100).toFixed(1) : 0}%
                                                </span>
                                            </div>
                                        </div>
                                        <Progress
                                            value={reviews.length > 0 ? (count / reviews.length) * 100 : 0}
                                            className="h-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 360 Feedback Tab */}
                <TabsContent value="feedback">
                    <Card>
                        <CardHeader>
                            <CardTitle>360-Degree Feedback System</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-6 border-2 border-dashed rounded-lg text-center">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <h3 className="font-semibold mb-2">360° Feedback Coming Soon</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Collect feedback from peers, managers, and direct reports
                                    </p>
                                    <Button variant="outline">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Request Feedback
                                    </Button>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                                        <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                        <div className="font-semibold">Peer Feedback</div>
                                        <div className="text-sm text-muted-foreground">From colleagues</div>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg text-center">
                                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                        <div className="font-semibold">Manager Feedback</div>
                                        <div className="text-sm text-muted-foreground">From supervisors</div>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                                        <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                        <div className="font-semibold">Self Assessment</div>
                                        <div className="text-sm text-muted-foreground">Your evaluation</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* New Review Dialog */}
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>New Performance Review</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Employee</Label>
                                <Select
                                    value={reviewData.employeeId}
                                    onValueChange={(value) => setReviewData({ ...reviewData, employeeId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map(emp => (
                                            <SelectItem key={emp.id} value={emp.id}>
                                                {emp.firstName} {emp.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Review Period</Label>
                                <Input
                                    type="text"
                                    placeholder="e.g., Q4 2024"
                                    value={reviewData.reviewPeriod}
                                    onChange={(e) => setReviewData({ ...reviewData, reviewPeriod: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Rating (1-5)</Label>
                            <div className="flex items-center gap-2 mt-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setReviewData({ ...reviewData, rating })}
                                        className="p-2"
                                    >
                                        <Star
                                            className={`h-8 w-8 ${rating <= reviewData.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 font-medium">{reviewData.rating}/5</span>
                            </div>
                        </div>

                        <div>
                            <Label>Overall Comments</Label>
                            <Textarea
                                value={reviewData.comments}
                                onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
                                placeholder="Overall performance feedback..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Strengths</Label>
                                <Textarea
                                    value={reviewData.strengths}
                                    onChange={(e) => setReviewData({ ...reviewData, strengths: e.target.value })}
                                    placeholder="Key strengths..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label>Areas for Improvement</Label>
                                <Textarea
                                    value={reviewData.improvements}
                                    onChange={(e) => setReviewData({ ...reviewData, improvements: e.target.value })}
                                    placeholder="Areas to improve..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Goals for Next Period</Label>
                            <Textarea
                                value={reviewData.goals}
                                onChange={(e) => setReviewData({ ...reviewData, goals: e.target.value })}
                                placeholder="Goals and objectives..."
                                rows={2}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Submit Review</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
