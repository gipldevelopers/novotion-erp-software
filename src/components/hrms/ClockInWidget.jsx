'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Monitor, Smartphone, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function ClockInWidget({ employeeId, onClockIn, onClockOut }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [clockInTime, setClockInTime] = useState(null);
    const [hoursWorked, setHoursWorked] = useState(0);
    const [location, setLocation] = useState(null);
    const [workMode, setWorkMode] = useState('office');
    const [loading, setLoading] = useState(false);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());

            // Update hours worked if clocked in
            if (isClockedIn && clockInTime) {
                const diff = new Date() - new Date(clockInTime);
                setHoursWorked(diff / (1000 * 60 * 60));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [isClockedIn, clockInTime]);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Location error:', error);
                }
            );
        }
    }, []);

    const handleClockIn = async () => {
        setLoading(true);
        try {
            const clockInData = {
                employeeId,
                timestamp: new Date().toISOString(),
                location,
                workMode,
                device: 'web',
            };

            if (onClockIn) {
                await onClockIn(clockInData);
            }

            setIsClockedIn(true);
            setClockInTime(new Date());
            toast.success('Clocked in successfully!');
        } catch (error) {
            toast.error('Failed to clock in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClockOut = async () => {
        setLoading(true);
        try {
            const clockOutData = {
                employeeId,
                timestamp: new Date().toISOString(),
                hoursWorked: hoursWorked.toFixed(2),
            };

            if (onClockOut) {
                await onClockOut(clockOutData);
            }

            setIsClockedIn(false);
            setClockInTime(null);
            setHoursWorked(0);
            toast.success(`Clocked out! You worked ${hoursWorked.toFixed(2)} hours today.`);
        } catch (error) {
            toast.error('Failed to clock out. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatHours = (hours) => {
        const h = Math.floor(hours);
        const m = Math.floor((hours - h) * 60);
        return `${h}h ${m}m`;
    };

    return (
        <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="space-y-4">
                    {/* Current Time Display */}
                    <div className="text-center">
                        <div className="text-4xl font-bold tracking-tight">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            {currentTime.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <Badge
                            variant={isClockedIn ? 'default' : 'secondary'}
                            className="text-sm px-4 py-1"
                        >
                            {isClockedIn ? (
                                <>
                                    <LogIn className="h-3 w-3 mr-1" />
                                    Clocked In
                                </>
                            ) : (
                                <>
                                    <LogOut className="h-3 w-3 mr-1" />
                                    Not Clocked In
                                </>
                            )}
                        </Badge>
                    </div>

                    {/* Hours Worked (if clocked in) */}
                    {isClockedIn && (
                        <div className="text-center space-y-1">
                            <div className="text-sm text-muted-foreground">Hours Worked Today</div>
                            <div className="text-2xl font-bold text-primary">
                                {formatHours(hoursWorked)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Since {clockInTime && formatTime(clockInTime)}
                            </div>
                        </div>
                    )}

                    {/* Work Mode Selector (when not clocked in) */}
                    {!isClockedIn && (
                        <div className="flex gap-2 justify-center">
                            <Button
                                variant={workMode === 'office' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setWorkMode('office')}
                            >
                                <Monitor className="h-4 w-4 mr-2" />
                                Office
                            </Button>
                            <Button
                                variant={workMode === 'remote' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setWorkMode('remote')}
                            >
                                <Smartphone className="h-4 w-4 mr-2" />
                                Remote
                            </Button>
                        </div>
                    )}

                    {/* Location Info */}
                    {location && (
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>Location detected</span>
                        </div>
                    )}

                    {/* Clock In/Out Button */}
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={isClockedIn ? handleClockOut : handleClockIn}
                        disabled={loading}
                        variant={isClockedIn ? 'destructive' : 'default'}
                    >
                        {loading ? (
                            'Processing...'
                        ) : isClockedIn ? (
                            <>
                                <LogOut className="h-5 w-5 mr-2" />
                                Clock Out
                            </>
                        ) : (
                            <>
                                <LogIn className="h-5 w-5 mr-2" />
                                Clock In
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
