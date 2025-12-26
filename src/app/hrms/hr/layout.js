"use client";
import HRSidebar from "./components/layout/HRSidebar";
import HRHeader from "./components/layout/HRHeader";
import { useSidebar } from "../context/SidebarContext";

export default function HRLayout({ children }) {
    const { isExpanded, isHovered } = useSidebar();

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#05070a] transition-colors duration-300 font-sans">
            <HRSidebar />
            <div
                className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:pl-[280px]" : "lg:pl-[80px]"
                    }`}
            >
                <HRHeader />
                <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
