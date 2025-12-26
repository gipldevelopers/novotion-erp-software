"use client";
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { employeeService } from '@/services/employeeService';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // If we have an auth user, fetch their full profile by ID
                // For demo, we use 'EMP001' if no ID is found
                const employeeId = authUser?.id || 'EMP001';
                const data = await employeeService.getEmployeeById(employeeId);
                setProfile(data);
            } catch (error) {
                toast.error("Failed to load profile data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [authUser]);

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Breadcrumb
                title="My Profile"
                subtitle="View and manage your personal and professional information"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-xl">
                                {profile?.firstName?.charAt(0) || 'U'}
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></div>
                        </div>
                        <h2 className="text-2xl font-bold mb-1">{profile?.firstName} {profile?.lastName}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">{profile?.designation}</p>
                        <div className="flex justify-center gap-4">
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition">Edit Profile</button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="font-bold mb-4">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">{profile?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">{profile?.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin size={16} className="text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">Main Office, HQ</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-xl font-bold mb-8 border-b border-gray-50 dark:border-gray-700 pb-4">Professional Overview</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Department</p>
                                    <p className="font-semibold">{profile?.department}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Designation</p>
                                    <p className="font-semibold">{profile?.designation}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Joining Date</p>
                                    <p className="font-semibold">{profile?.joinDate}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-600">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Work Type</p>
                                    <p className="font-semibold">Full-time / Office</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Biography</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {profile?.firstName} is a dedicated {profile?.designation} in the {profile?.department} department.
                            Joined on {profile?.joinDate} and since then contributing significantly to the team's success.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
