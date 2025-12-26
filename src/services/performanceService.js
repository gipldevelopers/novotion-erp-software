import { mockAppraisals } from './mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const performanceService = {
    getMyAppraisals: async () => {
        await delay();
        // In a real app, filter by current user's ID
        return [...mockAppraisals];
    }
};

export default performanceService;
