import { mockPayslips } from './mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const payrollService = {
    getMyPayslips: async (params = {}) => {
        await delay();
        // In a real app, filter by current user's ID
        let data = [...mockPayslips];

        const page = params.page || 1;
        const limit = params.limit || 10;
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const pagedData = data.slice(startIndex, startIndex + limit);

        return {
            data: pagedData,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit
            }
        };
    },

    getPayslipById: async (id) => {
        await delay();
        const payslip = mockPayslips.find(ps => ps.id === id);
        if (!payslip) throw new Error('Payslip not found');
        return payslip;
    }
};

export default payrollService;
