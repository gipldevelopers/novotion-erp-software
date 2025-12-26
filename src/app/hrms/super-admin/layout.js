"use client";
import AppSidebar from "../layout/AppSidebar";
import AppHeader from "../layout/AppHeader";
import { useSidebar } from "../context/SidebarContext";

export default function SuperAdminLayout({ children }) {
    const { isExpanded, isHovered } = useSidebar();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <AppSidebar />
            <div
                className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:pl-[290px]" : "lg:pl-[90px]"
                    }`}
            >
                <AppHeader />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
