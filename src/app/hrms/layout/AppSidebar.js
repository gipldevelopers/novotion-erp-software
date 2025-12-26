"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  Grid,
  Users,
  Target,
  Building,
  Calendar,
  Clock,
  FileText,
  PieChart,
  Settings,
  UserCircle,
  ChevronDown,
  MoreHorizontal,
  Briefcase,
  Presentation,
  CreditCard,
  Package,
  Shield,
  UserStar,
  CalendarDays
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const superAdminNavItems = [
  {
    icon: <Grid size={20} />,
    name: "Dashboard",
    path: "/hrms/super-admin/dashboard",
  },
  {
    icon: <Shield size={20} />,
    name: "Roles & Permissions",
    subItems: [
      { name: "Role Management", path: "/hrms/super-admin/roles-permissions" },
      { name: "Add New Role", path: "/hrms/super-admin/roles-permissions/add" },
    ],
  },
  {
    icon: <Users size={20} />,
    name: "User Management",
    subItems: [
      { name: "All Users", path: "/hrms/super-admin/users" },
      { name: "Admin Users", path: "/hrms/super-admin/users/admins" },
    ],
  },
  {
    icon: <Settings size={20} />,
    name: "System Settings",
    subItems: [
      { name: "General Settings", path: "/hrms/super-admin/settings/general" },
      { name: "Audit Logs", path: "/hrms/super-admin/settings/audit" },
    ],
  },
];

const hrNavItems = [
  {
    icon: <Grid size={20} />,
    name: "Dashboard",
    path: "/hrms/hr/dashboard",
  },
  {
    icon: <Users size={20} />,
    name: "Employee Management",
    subItems: [
      { name: "Employee List", path: "/hrms/hr/employees" },
      { name: "Add Employee", path: "/hrms/hr/employees/add" },
      // { name: "Employee Directory", path: "/hrms/hr/employees/directory" },
    ],
  },
  {
    icon: <Building size={20} />,
    name: "Department",
    subItems: [
      { name: "Department List", path: "/hrms/hr/departments" },
      { name: "Add Department", path: "/hrms/hr/departments/add" },
      { name: "Organization Chart", path: "/hrms/hr/departments/chart" },
    ],
  },
  {
    icon: <Briefcase size={20} />,
    name: "Designation",
    subItems: [
      { name: "Designation List", path: "/hrms/hr/designations" },
      { name: "Add Designation", path: "/hrms/hr/designations/add" },
      { name: "Designation Hierarchy", path: "/hrms/hr/designations/hierarchy" },
    ],
  },
  {
    icon: <Presentation size={20} />,
    name: "Attendance",
    subItems: [
      { name: "Dashboard", path: "/hrms/hr/attendance" },
    ],
  },
  {
    icon: <PieChart size={20} />,
    name: "Reports & Analytics",
    subItems: [
      { name: "Attendance Reports", path: "/hrms/hr/attendance/reports" },
      { name: "Employee Reports", path: "/hrms/hr/reports/employees" },
      { name: "Leave Reports", path: "/hrms/hr/reports/leave" },
      { name: "Department Reports", path: "/hrms/hr/reports/departments" },
    ],
  },
  {
    icon: <Calendar size={20} />,
    name: "Leave Management",
    subItems: [
      { name: "Dashboard", path: "/hrms/hr/leave" },
      { name: "Leave Requests", path: "/hrms/hr/leave/requests" },
      { name: "Leave Types", path: "/hrms/hr/leave/types" },
      { name: "Leave Calendar", path: "/hrms/hr/leave/calendar" },
      { name: "Holiday Calendar", path: "/hrms/hr/leave/holidays" },
      { name: "Leave Reports", path: "/hrms/hr/leave/reports" },
      { name: "Leave Policies", path: "/hrms/hr/leave/policies" },
    ],
  },
  {
    icon: <CreditCard size={20} />,
    name: "Payroll Management",
    subItems: [
      { name: "Payroll Dashboard", path: "/hrms/hr/payroll" },
      { name: "Salary Structure", path: "/hrms/hr/payroll/salary-structure" },
      { name: "Process Payroll", path: "/hrms/hr/payroll/process" },
      { name: "Payslips", path: "/hrms/hr/payroll/payslips" },
      { name: "Payroll Reports", path: "/hrms/hr/payroll/reports" },
      { name: "Tax Settings", path: "/hrms/hr/payroll/tax-settings" },
    ],
  },
  {
    icon: <Package size={20} />, // Import Package from lucide-react
    name: "Asset Management",
    subItems: [
      { name: "Asset Inventory", path: "/hrms/hr/assets" },
      { name: "Add Asset", path: "/hrms/hr/assets/add" },
      { name: "Asset Categories", path: "/hrms/hr/assets/categories" },
      { name: "Asset Assignments", path: "/hrms/hr/assets/assignments" },
      { name: "Maintenance History", path: "/hrms/hr/assets/maintenance" },
      { name: "Asset Reports", path: "/hrms/hr/assets/reports" },
    ],
  },
  {
    icon: <Settings size={20} />,
    name: "System Settings",
    subItems: [
      { name: "Role Management", path: "/hrms/hr/settings/roles" },
      { name: "Permission Management", path: "/hrms/hr/settings/permissions" },
      { name: "User Access Control", path: "/hrms/hr/settings/user-access" },
    ],
  },
  {
    icon: <UserStar size={20} />,
    name: "Roles & Permissions",
    subItems: [
      { name: "Role Management", path: "/hrms/super-admin/roles-permissions" },
      { name: "Add New Role", path: "/hrms/super-admin/roles-permissions/add" },
    ],
  },
];

const employeeNavItems = [
  {
    icon: <Grid size={20} />,
    name: "Dashboard",
    path: "/hrms/employee/dashboard",
  },
  {
    icon: <Clock size={20} />,
    name: "Attendance",
    subItems: [
      { name: "My Attendance", path: "/hrms/employee/attendance/my-attendance" },
      { name: "My Leaves", path: "/hrms/employee/attendance/my-leaves" },
      { name: "Leave Report", path: "/hrms/employee/attendance/leave-summery-details" },
      { name: "Holidays", path: "/hrms/employee/attendance/holidays" },
      { name: "Regularization", path: "/hrms/employee/attendance/regularization" },
      { name: "Overtime", path: "/hrms/employee/attendance/overtime" },
    ],
  },
  {
    icon: <Calendar size={20} />,
    name: "Leave Management",
    subItems: [
      { name: "Request Leave", path: "/hrms/employee/leave/request-leave" },
      { name: "Leave Balance", path: "/hrms/employee/leave/leave-balance" },
      { name: "Leave History", path: "/hrms/employee/leave/leave-history" },
      { name: "Holiday Calendar", path: "/hrms/employee/leave/team-calendar" },
    ],
  },
  {
    icon: <CalendarDays size={20} />,
    name: "Holiday",
    subItems: [
      { name: "Holiday List", path: "/hrms/employee/holiday" }
    ],
  },
  {
    icon: <FileText size={20} />,
    name: "Payrolls",
    subItems: [
      { name: "Salery Summery", path: "/hrms/employee/payslips/salery-summery" },
      { name: "Payslip", path: "/hrms/employee/payslips/pay-slips" },
      { name: "Payment History", path: "/hrms/employee/payslips/payment-history" },
      { name: "Tax Information", path: "/hrms/employee/payslips/tax-info" },
      { name: "Rembursment", path: "/hrms/employee/payslips/rembursment" },
    ],
  },
  {
    icon: <Settings size={20} />,
    name: "Settings",
    subItems: [
      { name: "Profile Picture", path: "/hrms/employee/settings/profile-picture" },
      { name: "Contact Information", path: "/hrms/employee/settings/contact-information" },
      { name: "Password Management", path: "/hrms/employee/settings/password-management" },
      { name: "Two-Factor Authentication (2FA)", path: "/hrms/employee/settings/two-factor-auth" },
      { name: "Connected Devices", path: "/hrms/employee/settings/connected-devices" },
    ],
  },
  {
    icon: <Target size={20} />,
    name: "Performance & Goals",
    subItems: [
      { name: "Goals", path: "/hrms/employee/performance/goals" },
      { name: "KPIs", path: "/hrms/employee/performance/kpis" },
      { name: "Feedback", path: "/hrms/employee/performance/feedback" },
      { name: "Skills", path: "/hrms/employee/performance/skills" },
      { name: "Training", path: "/hrms/employee/performance/training" },
      { name: "Recognition", path: "/hrms/employee/performance/recognition" },
    ],
  },
  // {
  //   icon: <Package size={20} />,
  //   name: "My Assets",
  //   path: "/hrms/employee/assets",
  // },
];

const AppSidebar = () => {
  const { user } = useAuth(); // Get user from auth context
  // const userRole = user?.role; // Extract role
  // const userRole = user?.role?.name || user?.role || 'EMPLOYEE';
  const userRole = user?.systemRole || 'EMPLOYEE'; // Use systemRole

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => path === pathname, [pathname]);

  // Get appropriate navigation items based on user role
  const getNavItems = () => {
    switch (userRole) {
      case "SUPER_ADMIN":  // Changed from "Super Admin"
        return superAdminNavItems;
      case "HR_ADMIN":     // Changed from "HR Admin"
        return hrNavItems;
      default:
        return employeeNavItems;
    }
  };

  useEffect(() => {
    let submenuMatched = false;
    const items = getNavItems();

    items.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, userRole]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu?.index === index) {
        return null;
      }
      return { index };
    });
  };

  const renderMenuItems = (navItems) => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group w-full ${openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`${openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text font-semibold`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  size={20}
                  className={`ml-auto transition-transform duration-200 ${openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group w-full ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text font-semibold`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}

      {/* My Profile - Always visible for all users */}
      <li>
        <Link
          href={
            userRole === "SUPER_ADMIN" ? "/hrms/super-admin/profile" :
              userRole === "HR_ADMIN" ? "/hrms/hr/profile" :
                "/hrms/employee/profile"
          }
          className={`menu-item group w-full ${pathname.includes("profile") ? "menu-item-active" : "menu-item-inactive"
            }`}
        >
          <span
            className={`${pathname.includes("profile")
              ? "menu-item-icon-active"
              : "menu-item-icon-inactive"
              }`}
          >
            <UserCircle size={20} />
          </span>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className={`menu-item-text font-semibold`}>My Profile</span>
          )}
        </Link>
      </li>
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-4 flex border-b border-transparent ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/GHR.PNG"
                alt="Logo"
                width={150}
                height={40}
                style={{ width: 'auto', height: 'auto' }} // Maintain aspect ratio
                priority
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/GHR2.PNG"
                alt="Logo"
                width={150}
                height={40}
                style={{ width: 'auto', height: 'auto' }} // Maintain aspect ratio
              />
            </>
          ) : (
            <Image
              src="/images/logo/GHR-COLLAPSED.PNG"
              alt="Logo"
              width={50}
              height={50}
              style={{ width: 'auto', height: 'auto' }}
            />
          )}
        </Link>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 mb-4"></div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  userRole === "SUPER_ADMIN" ? "Super Admin Portal" :
                    userRole === "HR_ADMIN" ? "HR Management" :
                      "Employee Portal"
                ) : (
                  <MoreHorizontal size={16} />
                )}
              </h2>
              {renderMenuItems(getNavItems())}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;