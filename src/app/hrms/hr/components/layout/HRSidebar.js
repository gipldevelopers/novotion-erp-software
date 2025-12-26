"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../../context/SidebarContext";
import {
    Grid,
    Users,
    Building,
    Briefcase,
    Presentation,
    Calendar,
    CreditCard,
    Package,
    Settings,
    PieChart,
    UserCheck,
    Search,
    ChevronDown,
    UserCircle,
    ShieldCheck,
    FileText,
    BarChart3,
    BookOpen
} from "lucide-react";

const hrNavItems = [
    {
        group: "Overview",
        items: [
            {
                icon: <Grid size={20} />,
                name: "HR Dashboard",
                path: "/hrms/hr/dashboard",
            },
        ]
    },
    {
        group: "Core Management",
        items: [
            {
                icon: <Users size={20} />,
                name: "Employees",
                subItems: [
                    { name: "Employee List", path: "/hrms/hr/employees" },
                    { name: "Add Employee", path: "/hrms/hr/employees/add" },
                    { name: "Documents", path: "/hrms/hr/employees/documents" },
                ],
            },
            {
                icon: <Building size={20} />,
                name: "Organization",
                subItems: [
                    { name: "Departments", path: "/hrms/hr/departments" },
                    { name: "Designations", path: "/hrms/hr/designations" },
                    { name: "Org Chart", path: "/hrms/hr/departments/chart" },
                ],
            },
        ]
    },
    {
        group: "Operations",
        items: [
            {
                icon: <UserCheck size={20} />,
                name: "Attendance",
                subItems: [
                    { name: "Daily Logs", path: "/hrms/hr/attendance" },
                    { name: "Attendance Reports", path: "/hrms/hr/attendance/reports" },
                ],
            },
            {
                icon: <Calendar size={20} />,
                name: "Leave Control",
                subItems: [
                    { name: "Requests", path: "/hrms/hr/leave/requests" },
                    { name: "Leave Types", path: "/hrms/hr/leave/types" },
                    { name: "Holiday Calendar", path: "/hrms/hr/leave/holidays" },
                ],
            },
            {
                icon: <Search size={20} />,
                name: "Recruitment",
                path: "/hrms/hr/recruitment",
            },
            {
                icon: <Package size={20} />,
                name: "Assets",
                subItems: [
                    { name: "Inventory", path: "/hrms/hr/assets" },
                    { name: "Assignments", path: "/hrms/hr/assets/assignments" },
                ],
            },
        ]
    },
    {
        group: "Financials",
        items: [
            {
                icon: <CreditCard size={20} />,
                name: "Payroll",
                subItems: [
                    { name: "Payroll Dashboard", path: "/hrms/hr/payroll" },
                    { name: "Salary Structure", path: "/hrms/hr/payroll/salary-structure" },
                    { name: "Process Salary", path: "/hrms/hr/payroll/process" },
                    { name: "Payslips", path: "/hrms/hr/payroll/payslips" },
                ],
            },
        ]
    },
    {
        group: "Analysis",
        items: [
            {
                icon: <PieChart size={20} />,
                name: "Reports",
                subItems: [
                    { name: "Employee Analytics", path: "/hrms/hr/reports/employees" },
                    { name: "Leave Analytics", path: "/hrms/hr/reports/leave" },
                ],
            },
        ]
    },
    {
        group: "System",
        items: [
            {
                icon: <Settings size={20} />,
                name: "HR Settings",
                subItems: [
                    { name: "Role Policies", path: "/hrms/hr/settings/roles" },
                    { name: "Permissions", path: "/hrms/hr/settings/permissions" },
                ],
            },
        ]
    }
];

export default function HRSidebar() {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const subMenuRefs = useRef({});
    const [subMenuHeight, setSubMenuHeight] = useState({});

    const isActive = useCallback((path) => path === pathname || pathname.startsWith(path + '/'), [pathname]);

    useEffect(() => {
        let matched = false;
        hrNavItems.forEach((group, gIdx) => {
            group.items.forEach((item, iIdx) => {
                if (item.subItems) {
                    item.subItems.forEach(sub => {
                        if (isActive(sub.path)) {
                            setOpenSubmenu(`${gIdx}-${iIdx}`);
                            matched = true;
                        }
                    });
                }
            });
        });
    }, [pathname, isActive]);

    useEffect(() => {
        if (openSubmenu && subMenuRefs.current[openSubmenu]) {
            setSubMenuHeight(prev => ({
                ...prev,
                [openSubmenu]: subMenuRefs.current[openSubmenu].scrollHeight
            }));
        }
    }, [openSubmenu]);

    const toggleSubmenu = (key) => {
        setOpenSubmenu(prev => prev === key ? null : key);
    };

    return (
        <aside
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-[#0f1117] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out
        ${isExpanded || isHovered ? "w-[280px]" : "w-[80px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        >
            {/* Sidebar Header */}
            <div className="h-20 flex items-center justify-center px-6 border-b border-gray-100 dark:border-gray-800/50">
                <Link href="/hrms" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    {(isExpanded || isHovered) && (
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-tight leading-none text-gray-900 dark:text-white uppercase">Novotion</span>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">HR Admin</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-4 space-y-8">
                {hrNavItems.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-2">
                        {(isExpanded || isHovered) && (
                            <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400/80 dark:text-gray-500 mb-2">
                                {group.group}
                            </h3>
                        )}
                        <ul className="space-y-1">
                            {group.items.map((item, itemIdx) => {
                                const key = `${groupIdx}-${itemIdx}`;
                                const hasSub = !!item.subItems;
                                const active = item.path ? isActive(item.path) : item.subItems?.some(s => isActive(s.path));

                                return (
                                    <li key={itemIdx}>
                                        {hasSub ? (
                                            <div>
                                                <button
                                                    onClick={() => toggleSubmenu(key)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
                            ${active ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}
                          `}
                                                >
                                                    <span className={`shrink-0 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                                                        {item.icon}
                                                    </span>
                                                    {(isExpanded || isHovered) && (
                                                        <>
                                                            <span className="text-sm font-bold flex-1 text-left">{item.name}</span>
                                                            <ChevronDown size={16} className={`transition-transform duration-300 ${openSubmenu === key ? "rotate-180" : ""}`} />
                                                        </>
                                                    )}
                                                </button>
                                                {(isExpanded || isHovered) && (
                                                    <div
                                                        ref={el => subMenuRefs.current[key] = el}
                                                        style={{ height: openSubmenu === key ? `${subMenuHeight[key] || 0}px` : "0px" }}
                                                        className="overflow-hidden transition-all duration-300 ease-in-out"
                                                    >
                                                        <ul className="mt-2 ml-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-1">
                                                            {item.subItems.map((sub, sIdx) => (
                                                                <li key={sIdx}>
                                                                    <Link
                                                                        href={sub.path}
                                                                        className={`block pl-6 py-2 text-xs font-bold transition-colors
                                      ${isActive(sub.path) ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"}
                                    `}
                                                                    >
                                                                        {sub.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                href={item.path}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
                          ${active ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}
                        `}
                                            >
                                                <span className={`shrink-0 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                                                    {item.icon}
                                                </span>
                                                {(isExpanded || isHovered) && (
                                                    <span className="text-sm font-bold">{item.name}</span>
                                                )}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/30 dark:bg-black/20">
                <Link href="/hrms/hr/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <UserCircle size={24} />
                    </div>
                    {(isExpanded || isHovered) && (
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="text-xs font-bold truncate">HR Administrator</span>
                            <span className="text-[10px] text-gray-400 truncate">admin@novotion.com</span>
                        </div>
                    )}
                </Link>
            </div>
        </aside>
    );
}
