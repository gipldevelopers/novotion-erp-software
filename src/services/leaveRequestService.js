// src/services/leaveRequestService.js
import { mockLeaves } from './mockData';

let leaves = [...mockLeaves];

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const leaveRequestService = {
  // Get all leave requests
  getAllLeaveRequests: async (params = {}) => {
    await simulateDelay();
    // Simulate filtering by status if needed
    if (params.status) {
      return leaves.filter(l => l.status === params.status);
    }
    return leaves;
  },

  // Get leave request by ID
  getLeaveRequestById: async (id) => {
    await simulateDelay();
    const leave = leaves.find(l => l.id === id);
    if (!leave) throw new Error('Leave request not found');
    return leave;
  },

  // Create new leave request
  createLeaveRequest: async (leaveRequestData) => {
    await simulateDelay();
    const newLeave = {
      ...leaveRequestData,
      id: leaves.length + 1,
      status: 'Pending',
      attachment: leaveRequestData.attachment ? 'mock-attachment.pdf' : null
    };
    leaves.push(newLeave);
    return newLeave;
  },

  // Update leave request
  updateLeaveRequest: async (id, leaveRequestData) => {
    await simulateDelay();
    const index = leaves.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Leave request not found');
    leaves[index] = { ...leaves[index], ...leaveRequestData };
    return leaves[index];
  },

  // Approve leave request
  approveLeaveRequest: async (id) => {
    await simulateDelay();
    const index = leaves.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Leave request not found');
    leaves[index].status = 'Approved';
    return leaves[index];
  },

  // Reject leave request
  rejectLeaveRequest: async (id, rejectionReason) => {
    await simulateDelay();
    const index = leaves.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Leave request not found');
    leaves[index].status = 'Rejected';
    leaves[index].rejectionReason = rejectionReason;
    return leaves[index];
  },

  // Get leave statistics
  getLeaveStats: async () => {
    await simulateDelay();
    return {
      total: leaves.length,
      approved: leaves.filter(l => l.status === 'Approved').length,
      pending: leaves.filter(l => l.status === 'Pending').length,
      rejected: leaves.filter(l => l.status === 'Rejected').length
    };
  },

  // Get leave types for dropdown
  getLeaveTypesDropdown: async () => {
    await simulateDelay();
    return [
      { id: 1, name: 'Sick Leave' },
      { id: 2, name: 'Casual Leave' },
      { id: 3, name: 'Earned Leave' },
      { id: 4, name: 'Maternity Leave' },
      { id: 5, name: 'Paternity Leave' },
      { id: 6, name: 'Unpaid Leave' }
    ];
  }
};

export default leaveRequestService;