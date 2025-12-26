"use client";
import React, { useRef, useEffect } from "react";
import { ThemeToggle } from "../../../../components/ThemeToggle";
import { useSidebar } from "../../../context/SidebarContext";
import { useAuth } from "../../../context/AuthContext";
import {
    Bell,
    Menu,
    Search,
    Settings,
    Plus,
    UserCircle,
    HelpCircle,
    Hash
} from "lucide-react";
import Image from "next/image";

export default function HRHeader() {
    const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar();
    const { user, loading } = useAuth();
    const searchRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="h-20 px-4 md:px-8 flex items-center justify-between gap-4">
                {/* Left Section: Context & Sidebar Trigger */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleToggle}
                        className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-all active:scale-95 border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                        aria-label="Toggle Navigation"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">HR Center</span>
                        <div className="h-3 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1"></div>
                        <span className="text-xs font-bold text-gray-500 truncate max-w-[150px]">
                            {loading ? "..." : `v1.2.4`}
                        </span>
                    </div>
                </div>

                {/* Center Section: Global Search */}
                <div className="flex-1 max-w-xl hidden md:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search records, policies or type command... (Ctrl+K)"
                            className="w-full h-11 pl-12 pr-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[10px] font-black text-gray-400 uppercase tracking-tighter shadow-sm">
                                CMD K
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Section: Actions & User */}
                <div className="flex items-center gap-3">
                    {/* Quick Add (HR-specific) */}
                    <button className="hidden xl:flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                        <Plus size={18} />
                        <span>Add New</span>
                    </button>

                    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                        <ThemeToggle />

                        <button className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-colors group">
                            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-gray-50 dark:border-gray-900 rounded-full animate-pulse"></span>
                        </button>

                        <button className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                            <HelpCircle size={20} />
                        </button>
                    </div>

                    <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-1 hidden sm:block"></div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-1">
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                                {user?.employee?.firstName || user?.name || "Admin"}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                HR Manager
                            </span>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg group cursor-pointer transition-transform hover:scale-105 active:scale-95">
                            <div className="w-full h-full rounded-[14px] bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                <UserCircle size={24} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
