// Updated: 2025-12-27
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const defaultConfig = {
    primaryColor: '221 83% 53%',
    secondaryColor: '215 20% 95%',
    sidebarColor: '222 47% 11%',
    borderRadius: 0.5,
    fontSize: 16,
};
const applyThemeConfig = (config) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', config.primaryColor);
    root.style.setProperty('--secondary', config.secondaryColor);
    root.style.setProperty('--sidebar-background', config.sidebarColor);
    root.style.setProperty('--radius', `${config.borderRadius}rem`);
    root.style.fontSize = `${config.fontSize}px`;
};
const applyThemeMode = (mode) => {
    const root = document.documentElement;
    if (mode === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', systemDark);
    }
    else {
        root.classList.toggle('dark', mode === 'dark');
    }
};
export const useThemeStore = create()(persist((set, get) => ({
    mode: 'light',
    config: defaultConfig,
    setMode: (mode) => {
        set({ mode });
        applyThemeMode(mode);
    },
    setConfig: (partialConfig) => {
        const newConfig = { ...get().config, ...partialConfig };
        set({ config: newConfig });
        applyThemeConfig(newConfig);
    },
    resetConfig: () => {
        set({ config: defaultConfig });
        applyThemeConfig(defaultConfig);
    },
}), {
    name: 'erp-theme-storage',
    onRehydrateStorage: () => (state) => {
        if (state) {
            applyThemeMode(state.mode);
            applyThemeConfig(state.config);
        }
    },
}));
