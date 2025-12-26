import { mockRoles } from './mockData';

let roles = [...mockRoles];
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const roleService = {
  getAllRoles: async (params = {}) => {
    await simulateDelay();
    return roles;
  },
  getRoleById: async (id) => {
    await simulateDelay();
    return roles.find(r => r.id === id);
  },
  createRole: async (data) => {
    await simulateDelay();
    const newRole = { ...data, id: roles.length + 1 };
    roles.push(newRole);
    return newRole;
  },
  updateRole: async (id, data) => {
    await simulateDelay();
    const idx = roles.findIndex(r => r.id === id);
    if (idx !== -1) roles[idx] = { ...roles[idx], ...data };
    return roles[idx];
  },
  deleteRole: async (id) => {
    await simulateDelay();
    roles = roles.filter(r => r.id !== id);
    return { message: 'Deleted' };
  },
  getRolePermissions: async (id) => {
    await simulateDelay();
    const role = roles.find(r => r.id === id);
    return role ? role.permissions : [];
  },
  updateRolePermissions: async (id, permissions) => {
    await simulateDelay();
    const idx = roles.findIndex(r => r.id === id);
    if (idx !== -1) roles[idx].permissions = permissions && permissions.permissions ? permissions.permissions : permissions;
    return roles[idx];
  },
  checkRoleHasUsers: async (id) => {
    await simulateDelay();
    return { hasUsers: false };
  }
};

export default roleService;