// Updated: 2025-12-27
'use client';

import React, { useEffect, useState } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Star, BarChart2, Plus, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function PerformancePage() {
    const [reviews, setReviews] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        employeeId: '',
        reviewPeriod: '2024 Q4',
        rating: '',
        reviewer: 'Admin User',
        comments: ''
    });

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

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateReview = async (e) => {
        e.preventDefault();
        try {
            await hrmsService.createPerformanceReview({
                ...formData,
                rating: Number(formData.rating)
            });
            toast.success("Performance review submitted");
            setIsDialogOpen(false);
            setFormData({ employeeId: '', reviewPeriod: '2024 Q4', rating: '', reviewer: 'Admin User', comments: '' });
            fetchData();
        } catch (error) {
            toast.error("Failed to submit review");
        }
    };

    const getEmployeeName = (id) => {
        const emp = employees.find(e => e.id === id);
        return emp ? `${emp.firstName} ${emp.lastName}` : id;
    };

    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        name: `${star} Stars`,
        count: reviews.filter(r => Math.round(r.rating) === star).length
    }));

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Performance Reviews</h2>
                    <p className="text-muted-foreground">Track and manage employee evaluations.</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Evaluation
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Rating Distribution</CardTitle>
                        <CardDescription>Overview of company-wide performance scores.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ratingDistribution} layout="vertical" margin={{ left: 40 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={60} tickLine={false} axisLine={false} fontSize={12} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-900/40 border-blue-200 dark:border-blue-800 flex flex-col justify-center">
                    <CardHeader className="pb-2 text-center">
                        <CardTitle className="text-blue-700 dark:text-blue-300 text-lg">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-5xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                            {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)).toFixed(1)}
                        </div>
                        <div className="flex justify-center text-blue-600 dark:text-blue-400">
                            <Star className="h-5 w-5 fill-current" />
                            <Star className="h-5 w-5 fill-current" />
                            <Star className="h-5 w-5 fill-current" />
                            <Star className="h-5 w-5 fill-current" />
                            <Star className="h-5 w-5 fill-current opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Evaluations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Review Period</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Reviewer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-6">Loading reviews...</TableCell></TableRow>
                            ) : reviews.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-6">No reviews found.</TableCell></TableRow>
                            ) : (
                                reviews.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {review.employeeId.slice(-3)}
                                                </div>
                                                {getEmployeeName(review.employeeId)}
                                            </div>
                                        </TableCell>
                                        <TableCell>{review.reviewPeriod}</TableCell>
                                        <TableCell>
                                            <Badge variant={review.rating >= 4 ? 'default' : review.rating >= 3 ? 'secondary' : 'destructive'}>
                                                {review.rating} / 5
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{review.reviewer}</TableCell>
                                        <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedReview(review)}>View Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create Review Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Performance Evaluation</DialogTitle>
                        <DialogDescription>Submit a new quarterly or annual review.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateReview} className="space-y-4 pt-4">
                        <div className="grid gap-2">
                            <Label>Employee</Label>
                            <Select
                                value={formData.employeeId}
                                onValueChange={(val) => setFormData({ ...formData, employeeId: val })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map(emp => (
                                        <SelectItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Review Period</Label>
                                <Select
                                    value={formData.reviewPeriod}
                                    onValueChange={(val) => setFormData({ ...formData, reviewPeriod: val })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2024 Q4">2024 Q4</SelectItem>
                                        <SelectItem value="2024 Q3">2024 Q3</SelectItem>
                                        <SelectItem value="2024 Annual">2024 Annual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Rating (1-5)</Label>
                                <Input
                                    type="number" min="1" max="5" step="0.1"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Feedback & Comments</Label>
                            <Textarea
                                value={formData.comments}
                                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                placeholder="Detailed feedback..."
                                className="min-h-[100px]"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Submit Review</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Review Details Sheet */}
            <Sheet open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Evaluation Details</SheetTitle>
                        <SheetDescription>
                            Full review for {selectedReview && getEmployeeName(selectedReview.employeeId)}
                        </SheetDescription>
                    </SheetHeader>
                    {selectedReview && (
                        <div className="space-y-6 mt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase font-bold">Period</span>
                                    <div className="font-medium">{selectedReview.reviewPeriod}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase font-bold">Reviewer</span>
                                    <div className="font-medium">{selectedReview.reviewer}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase font-bold">Date</span>
                                    <div className="font-medium">{new Date(selectedReview.date).toLocaleDateString()}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase font-bold">Overall Rating</span>
                                    <div className="flex items-center gap-1 font-bold text-lg text-blue-600">
                                        {selectedReview.rating} <Star className="h-4 w-4 fill-current" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs text-muted-foreground uppercase font-bold">Comments</span>
                                <div className="p-4 bg-muted/50 rounded-lg text-sm leading-relaxed">
                                    "{selectedReview.comments}"
                                </div>
                            </div>
                            <Button className="w-full" variant="outline" onClick={() => setSelectedReview(null)}>Close</Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
