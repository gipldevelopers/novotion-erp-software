import { useAuthStore } from '@/stores/authStore';

/**
 * Custom hook to determine HRMS role and permissions
 * Returns employee ID, role flags, and helper functions
 */
export function useHRMSRole() {
    const user = useAuthStore((state) => state.user);

    // Get employee ID from user data
    const employeeId = user?.employeeId || null;

    // Determine if user is a manager (can manage team)
    const isManager = user?.isManager || user?.roles?.includes('manager') || user?.role === 'manager' || user?.role === 'hr';

    // Determine if user is HR Admin (full HRMS access)
    const isHRAdmin = user?.roles?.includes('hr_admin') || user?.role === 'hr' || user?.role === 'admin';

    // Determine if user is regular employee (personal access only)
    const isEmployee = user?.role === 'employee' || (!isManager && !isHRAdmin && employeeId);

    /**
     * Get the default HRMS route based on user role
     */
    const getDefaultRoute = () => {
        if (isHRAdmin) return '/erp/hrms/dashboard';
        if (isManager) return '/erp/hrms/manager/dashboard';
        if (isEmployee) return '/erp/hrms/me/dashboard';
        return '/erp/hrms/dashboard';
    };

    /**
     * Check if user has access to a specific HRMS section
     */
    const hasAccess = (section) => {
        switch (section) {
            case 'admin':
                return isHRAdmin;
            case 'manager':
                return isManager || isHRAdmin;
            case 'employee':
                return isEmployee || isManager || isHRAdmin;
            default:
                return false;
        }
    };

    return {
        employeeId,
        isManager,
        isHRAdmin,
        isEmployee,
        getDefaultRoute,
        hasAccess,
        user,
    };
}
