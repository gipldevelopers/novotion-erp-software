"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import {
    ShieldCheck,
    Users,
    Settings,
    Lock,
    Activity,
    Database,
    Cloud,
    Globe
} from 'lucide-react';

export default function SuperAdminDashboard() {
    const stats = [
        { title: "Active Users", value: "1,284", icon: <Users />, color: "bg-blue-600" },
        { title: "System Health", value: "99.9%", icon: <Activity />, color: "bg-green-600" },
        { title: "Database Size", value: "4.2 GB", icon: <Database />, color: "bg-purple-600" },
        { title: "Server Load", value: "24%", icon: <Cloud />, color: "bg-yellow-600" },
    ];

    return (
        <div className="space-y-6">
            <Breadcrumb
                title="Admin Control Center"
                subtitle="Global system overview and administrative tools"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className={`p-3 w-12 h-12 rounded-xl text-white mb-4 ${stat.color} flex items-center justify-center`}>
                            {stat.icon}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <ShieldCheck className="text-blue-600" /> Security Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Lock size={18} className="text-gray-400" />
                                <span className="font-medium">SSL Certificate</span>
                            </div>
                            <span className="text-green-500 text-xs font-bold uppercase">Valid</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-gray-400" />
                                <span className="font-medium">Global CDN</span>
                            </div>
                            <span className="text-green-500 text-xs font-bold uppercase">Active</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Settings size={18} className="text-gray-400" />
                                <span className="font-medium">Auto Backups</span>
                            </div>
                            <span className="text-blue-500 text-xs font-bold uppercase">Daily</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Enterprise Version</h3>
                        <p className="opacity-80 mb-8">You are currently running the enterprise edition of Novotion ERP. All features are unlocked and managed by the central administration.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-white text-blue-600 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50 transition">System Logs</button>
                        <button className="px-6 py-2 bg-blue-700 text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition">Update System</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
