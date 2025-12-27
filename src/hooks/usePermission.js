import { useAuthStore } from '@/stores/authStore';
export const usePermission = () => {
    const { hasPermission, hasAnyPermission, user } = useAuthStore();
    const can = (permission) => {
        return hasPermission(permission);
    };
    const canAny = (permissions) => {
        return hasAnyPermission(permissions);
    };
    const canAll = (permissions) => {
        return permissions.every(p => hasPermission(p));
    };
    return {
        can,
        canAny,
        canAll,
        permissions: user?.permissions ?? [],
        role: user?.role,
    };
};
