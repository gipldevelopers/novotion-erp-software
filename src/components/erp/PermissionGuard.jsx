import { usePermission } from '@/hooks/usePermission';
export const PermissionGuard = ({ permission, permissions, requireAll = false, fallback = null, children, }) => {
    const { can, canAny, canAll } = usePermission();
    let hasAccess = false;
    if (permission) {
        hasAccess = can(permission);
    }
    else if (permissions) {
        hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
    }
    else {
        hasAccess = true;
    }
    return hasAccess ? <>{children}</> : <>{fallback}</>;
};
