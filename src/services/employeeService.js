// src/services/employeeService.js
import { mockEmployees, mockDepartments, mockDesignations } from './mockData';

// In-memory state
let employees = [...mockEmployees];
let departments = [...mockDepartments];
let designations = [...mockDesignations];

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const employeeService = {

  getManagers: async () => {
    await simulateDelay();
    return { data: employees.filter(e => e.role === 'MANAGER') }; // Axios response structure often has .data
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    await simulateDelay();
    const newEmployee = {
      ...employeeData,
      id: employeeData.id || `EMP${String(employees.length + 1).padStart(3, '0')}`,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    employees.push(newEmployee);
    return newEmployee;
  },

  // Get all employees
  getAllEmployees: async (params = {}) => {
    await simulateDelay();
    // Simple filter simulation if needed, for now return all
    return employees;
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    await simulateDelay();
    const emp = employees.find(e => e.id === id);
    if (!emp) throw new Error('Employee not found');
    return emp;
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    await simulateDelay();
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    employees[index] = { ...employees[index], ...employeeData };
    return employees[index];
  },

  // Delete employee
  deleteEmployee: async (id) => {
    await simulateDelay();
    employees = employees.filter(e => e.id !== id);
    return { message: 'Employee deleted successfully' };
  },

  // Get next employee ID
  getNextEmployeeId: async () => {
    await simulateDelay();
    return { nextId: `EMP${String(employees.length + 1).padStart(3, '0')}` };
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    await simulateDelay();
    return {
      total: employees.length,
      active: employees.filter(e => e.status === 'Active').length,
      onLeave: 0, // Mock
      newJoiners: 0 // Mock
    };
  },

  // Upload employee document
  uploadDocument: async (employeeId, formData) => {
    await simulateDelay();
    return { message: 'Document uploaded successfully' };
  },

  // Get employee documents
  getDocuments: async (employeeId) => {
    await simulateDelay();
    return []; // Return empty list for now
  },

  // Delete employee document
  deleteDocument: async (employeeId, docId) => {
    await simulateDelay();
    return { message: 'Document deleted' };
  },

  // Get departments for dropdown
  getDepartments: async () => {
    await simulateDelay();
    return departments;
  },

  // Get designations for dropdown
  getDesignations: async () => {
    await simulateDelay();
    return designations;
  },
};

export default employeeService;