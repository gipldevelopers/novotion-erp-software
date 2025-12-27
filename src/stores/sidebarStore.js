import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useSidebarStore = create()(persist((set) => ({
    isCollapsed: false,
    isMobileOpen: false,
    toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
    setMobileOpen: (open) => set({ isMobileOpen: open }),
}), {
    name: 'erp-sidebar-storage',
    partialize: (state) => ({ isCollapsed: state.isCollapsed }),
}));
