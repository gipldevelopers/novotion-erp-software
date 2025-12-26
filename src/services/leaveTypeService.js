// Mock Leave Type Service
const mockLeaveTypes = [
  {
    id: 1,
    name: "Annual Leave",
    code: "AL",
    daysAllowed: 20,
    carryForward: true,
    maxCarryForward: 5,
    description: "Annual paid leave",
  },
  {
    id: 2,
    name: "Sick Leave",
    code: "SL",
    daysAllowed: 12,
    carryForward: false,
    maxCarryForward: 0,
    description: "Medical leave for illness",
  },
  {
    id: 3,
    name: "Casual Leave",
    code: "CL",
    daysAllowed: 10,
    carryForward: false,
    maxCarryForward: 0,
    description: "Short-term casual leave",
  },
];

export const leaveTypeService = {
  // Get all leave types
  getAllLeaveTypes: async (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockLeaveTypes, total: mockLeaveTypes.length });
      }, 100);
    });
  },

  // Get leave type by ID
  getLeaveTypeById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const leaveType = mockLeaveTypes.find((lt) => lt.id === parseInt(id));
        if (leaveType) {
          resolve({ data: leaveType });
        } else {
          reject(new Error("Leave type not found"));
        }
      }, 100);
    });
  },

  // Create new leave type
  createLeaveType: async (leaveTypeData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLeaveType = {
          id: mockLeaveTypes.length + 1,
          ...leaveTypeData,
        };
        mockLeaveTypes.push(newLeaveType);
        resolve({ data: newLeaveType });
      }, 100);
    });
  },

  // Update leave type
  updateLeaveType: async (id, leaveTypeData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockLeaveTypes.findIndex((lt) => lt.id === parseInt(id));
        if (index !== -1) {
          mockLeaveTypes[index] = { ...mockLeaveTypes[index], ...leaveTypeData };
          resolve({ data: mockLeaveTypes[index] });
        } else {
          reject(new Error("Leave type not found"));
        }
      }, 100);
    });
  },

  // Delete leave type
  deleteLeaveType: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockLeaveTypes.findIndex((lt) => lt.id === parseInt(id));
        if (index !== -1) {
          mockLeaveTypes.splice(index, 1);
          resolve({ message: "Leave type deleted successfully" });
        } else {
          reject(new Error("Leave type not found"));
        }
      }, 100);
    });
  },

  // Get leave types for dropdown
  getLeaveTypesDropdown: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dropdown = mockLeaveTypes.map((lt) => ({
          value: lt.id,
          label: lt.name,
        }));
        resolve({ data: dropdown });
      }, 100);
    });
  },
};

export default leaveTypeService;