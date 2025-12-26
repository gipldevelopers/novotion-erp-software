import { mockDesignations } from './mockData';

let designations = [...mockDesignations];
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const designationService = {
  getAllDesignations: async (params = {}) => {
    await simulateDelay();
    return designations;
  },
  getDesignationById: async (id) => {
    await simulateDelay();
    return designations.find(d => d.id === id);
  },
  createDesignation: async (data) => {
    await simulateDelay();
    const newDes = { ...data, id: designations.length + 1 };
    designations.push(newDes);
    return newDes;
  },
  updateDesignation: async (id, data) => {
    await simulateDelay();
    const idx = designations.findIndex(d => d.id === id);
    if (idx !== -1) designations[idx] = { ...designations[idx], ...data };
    return designations[idx];
  },
  deleteDesignation: async (id) => {
    await simulateDelay();
    designations = designations.filter(d => d.id !== id);
    return { message: 'Deleted' };
  }
};

export default designationService;