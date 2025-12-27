// Updated: 2025-12-27
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calculator, FileText, CreditCard, BookOpen, Receipt, PieChart, Users, UserPlus, Contact, Briefcase, Calendar, Wallet, ShoppingCart, ReceiptText, Settings, Shield, Lock, ChevronDown, ChevronLeft, ChevronRight, LogOut, X, Activity, ListTodo, MessageSquare, LayoutGrid, Clock, DollarSign, TrendingUp, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { usePermission } from '@/hooks/usePermission';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
const navigation = [
  {
    title: 'Dashboard',
    href: '/erp/dashboard',
    icon: LayoutDashboard,
    permission: 'dashboard.view',
  },
  {
    title: 'Accounting',
    icon: Calculator,
    permission: 'accounting.view',
    children: [
      { title: 'Dashboard', href: '/erp/accounting/dashboard', icon: PieChart, permission: 'accounting.view' },
      { title: 'Invoices', href: '/erp/accounting/invoices', icon: FileText, permission: 'invoices.view' },
      { title: 'Payments', href: '/erp/accounting/payments', icon: CreditCard, permission: 'payments.view' },
      { title: 'Ledgers', href: '/erp/accounting/ledgers', icon: BookOpen, permission: 'ledgers.view' },
      { title: 'Expenses', href: '/erp/accounting/expenses', icon: Receipt, permission: 'expenses.view' },
      { title: 'Reports', href: '/erp/accounting/reports', icon: PieChart, permission: 'reports.view' },
    ],
  },
  {
    title: 'CRM',
    icon: Contact,
    permission: 'crm.view',
    children: [
      { title: 'Customers', href: '/erp/crm/customers', icon: Users, permission: 'customers.view' },
      { title: 'Leads', href: '/erp/crm/leads', icon: UserPlus, permission: 'leads.view' },
      { title: 'Activities', href: '/erp/crm/activities', icon: Activity, permission: 'crm.view' },
      { title: 'Tasks', href: '/erp/crm/tasks', icon: ListTodo, permission: 'crm.view' },
      { title: 'Comms', href: '/erp/crm/communications', icon: MessageSquare, permission: 'crm.view' },
      { title: 'Calendar', href: '/erp/crm/calendar', icon: Calendar, permission: 'crm.view' },
      { title: 'Reports', href: '/erp/crm/reports', icon: PieChart, permission: 'reports.view' },
    ],
  },
  {
    title: 'HRMS',
    icon: Users,
    permission: 'hrms.view',
    children: [
      { title: 'Dashboard', href: '/erp/hrms/dashboard', icon: LayoutGrid, permission: 'hrms.view' },
      { title: 'Employees', href: '/erp/hrms/employees', icon: Users, permission: 'employees.view' },
      { title: 'Attendance', href: '/erp/hrms/attendance', icon: Clock, permission: 'attendance.view' },
      { title: 'Leaves', href: '/erp/hrms/leaves', icon: Calendar, permission: 'leaves.view' },
      { title: 'Payroll', href: '/erp/hrms/payroll', icon: DollarSign, permission: 'payroll.view' },
      { title: 'Performance', href: '/erp/hrms/performance', icon: TrendingUp, permission: 'performance.view' },
      { title: 'Reports', href: '/erp/hrms/reports', icon: PieChart, permission: 'hrms_reports.view' },
    ],
  },
  {
    title: 'POS',
    icon: ShoppingCart,
    permission: 'pos.view',
    children: [
      { title: 'Dashboard', href: '/erp/pos/dashboard', icon: LayoutGrid, permission: 'pos.view' },
      { title: 'Billing', href: '/erp/pos/billing', icon: ShoppingCart, permission: 'billing.view' },
      { title: 'Invoices', href: '/erp/pos/invoices', icon: ReceiptText, permission: 'invoices.view' },
      { title: 'Services', href: '/erp/pos/products', icon: Package, permission: 'products.view' },
      { title: 'Customers', href: '/erp/pos/customers', icon: Users, permission: 'customers.view' },
      { title: 'Sessions', href: '/erp/pos/sessions', icon: Clock, permission: 'sessions.view' },
      { title: 'Reports', href: '/erp/pos/reports', icon: PieChart, permission: 'pos_reports.view' },
    ],
  },
  {
    title: 'Admin',
    icon: Settings,
    permission: 'admin.view',
    children: [
      { title: 'Users', href: '/erp/admin/users', icon: Users, permission: 'users.view' },
      { title: 'Roles', href: '/erp/admin/roles', icon: Shield, permission: 'roles.view' },
      { title: 'Permissions', href: '/erp/admin/permissions', icon: Lock, permission: 'permissions.view' },
      { title: 'Settings', href: '/erp/admin/settings', icon: Settings, permission: 'settings.view' },
    ],
  },
];
export const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed: isCollapsedDesktop, toggleCollapsed, isMobileOpen, setMobileOpen } = useSidebarStore();
  const { can } = usePermission();
  const { logout, user } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState([]);
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mql.matches)
        setMobileOpen(false);
    };
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [setMobileOpen]);
  const toggleExpanded = (title) => {
    setExpandedItems((prev) => prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]);
  };
  const isActive = (href) => {
    if (!href)
      return false;
    return pathname === href || pathname.startsWith(href + '/');
  };
  const renderNavItem = (item, collapsed, depth = 0) => {
    if (item.permission && !can(item.permission)) {
      return null;
    }
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const active = isActive(item.href);
    if (collapsed && depth === 0) {
      return (<Tooltip key={item.title} delayDuration={0}>
        <TooltipTrigger asChild>
          {item.href ? (<Link href={item.href} onClick={() => {
            if (isMobileOpen)
              setMobileOpen(false);
          }} className={cn('flex items-center justify-center h-10 w-10 rounded-lg transition-colors mx-auto', active
            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground')}>
            <item.icon className="h-5 w-5" />
          </Link>) : (<button onClick={() => toggleExpanded(item.title)} className={cn('flex items-center justify-center h-10 w-10 rounded-lg transition-colors mx-auto', 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground')}>
            <item.icon className="h-5 w-5" />
          </button>)}
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {item.title}
          {hasChildren && (<div className="flex flex-col gap-1">
            {item.children?.map((child) => {
              if (child.permission && !can(child.permission))
                return null;
              return (<Link key={child.title} href={child.href} onClick={() => setMobileOpen(false)} className="text-sm hover:text-primary">
                {child.title}
              </Link>);
            })}
          </div>)}
        </TooltipContent>
      </Tooltip>);
    }
    return (<div key={item.title}>
      {item.href ? (<Link href={item.href} onClick={() => {
        if (isMobileOpen)
          setMobileOpen(false);
      }} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg transition-colors', active
        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground', depth > 0 && 'ml-4')}>
        <item.icon className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{item.title}</span>
      </Link>) : (<button onClick={() => toggleExpanded(item.title)} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full', 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground')}>
        <item.icon className="h-4 w-4 flex-shrink-0" />
        <span className="truncate flex-1 text-left">{item.title}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
      </button>)}

      {hasChildren && isExpanded && !collapsed && (<div className="mt-1 space-y-1">
        {item.children?.map((child) => renderNavItem(child, collapsed, depth + 1))}
      </div>)}
    </div>);
  };
  const SidebarContent = ({ collapsed, mode }) => {
    return (<div className="flex h-full flex-col">
      <div className={cn('h-16 flex items-center justify-between px-4 border-b border-sidebar-border', collapsed && 'px-2')}>
        {!collapsed && (<span className="text-lg font-semibold text-sidebar-accent-foreground">
          ERP System
        </span>)}
        {mode === 'mobile' ? (<Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <X className="h-4 w-4" />
        </Button>) : (<Button variant="ghost" size="icon" onClick={toggleCollapsed} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          {collapsed ? (<ChevronRight className="h-4 w-4" />) : (<ChevronLeft className="h-4 w-4" />)}
        </Button>)}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className={cn('space-y-1', collapsed ? 'px-1' : 'px-2')}>
          {navigation.map((item) => renderNavItem(item, collapsed))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        {collapsed ? (<Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={logout} className="w-10 h-10 mx-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </TooltipContent>
        </Tooltip>) : (<div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground capitalize">{user?.role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>)}
      </div>
    </div>);
  };
  return (<>
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="lg:hidden w-80 bg-sidebar p-0 text-sidebar-foreground border-sidebar-border [&>button]:hidden">
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
        <aside className="h-full w-full">
          <SidebarContent collapsed={false} mode="mobile" />
        </aside>
      </SheetContent>
    </Sheet>

    <aside className={cn('hidden lg:flex fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border flex-col shadow-sm transition-[width] duration-300', isCollapsedDesktop ? 'w-16' : 'w-64')}>
      <SidebarContent collapsed={isCollapsedDesktop} mode="desktop" />
    </aside>
  </>);
};
