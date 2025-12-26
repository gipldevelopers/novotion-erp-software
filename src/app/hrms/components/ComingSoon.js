"use client";
import React from 'react';
import { Construction } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function ComingSoon({ title, description }) {
    return (
        <div className="space-y-6">
            <Breadcrumb
                title={title || "Working on it!"}
                subtitle={description || "This page is currently under development to bring you the best experience."}
            />

            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 animate-pulse">
                    <Construction size={48} />
                </div>
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Fully Functional Page Coming Soon</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                    We are building this page to follow our premium design system with full dark mode support and interactive features.
                </p>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm font-medium">Dark Mode Ready</div>
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm font-medium">Responsive Layout</div>
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm font-medium">Premium UI</div>
                </div>
            </div>
        </div>
    );
}
