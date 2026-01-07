// Updated: 2025-12-27
'use client';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebarStore } from '@/stores/sidebarStore';
export const ERPLayout = ({ children }) => {
    const { isCollapsed } = useSidebarStore();
    return (<div className={`erp-container ${isCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
      <Sidebar />
      <div className="erp-main">
        <Header />
        <main className="erp-content">
          {children}
        </main>
      </div>
    </div>);
};
