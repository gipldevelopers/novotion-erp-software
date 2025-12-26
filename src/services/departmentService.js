import { mockDepartments } from './mockData';

let departments = [...mockDepartments];
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const departmentService = {
  getAllDepartments: async (params = {}) => {
    await simulateDelay();
    return departments;
  },
  getDepartmentById: async (id) => {
    await simulateDelay();
    return departments.find(d => d.id === id);
  },
  createDepartment: async (data) => {
    await simulateDelay();
    const newDept = { ...data, id: departments.length + 1 };
    departments.push(newDept);
    return newDept;
  },
  updateDepartment: async (id, data) => {
    await simulateDelay();
    const idx = departments.findIndex(d => d.id === id);
    if (idx !== -1) departments[idx] = { ...departments[idx], ...data };
    return departments[idx];
  },
  deleteDepartment: async (id) => {
    await simulateDelay();
    departments = departments.filter(d => d.id !== id);
    return { message: 'Deleted' };
  },
  getDepartmentEmployees: async (id) => {
    await simulateDelay();
    return []; // Mock empty list
  }
};

export default departmentService;