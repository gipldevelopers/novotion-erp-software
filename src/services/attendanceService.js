import { mockAttendance } from './mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
    getMyAttendance: async (params = {}) => {
        await delay(500);
        // In a real app, this would filter by current user's ID
        let data = [...mockAttendance];

        if (params.search) {
            const search = params.search.toLowerCase();
            data = data.filter(item =>
                item.date.toLowerCase().includes(search) ||
                item.status.toLowerCase().includes(search)
            );
        }

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

    clockIn: async (employeeId) => {
        await delay(500);
        const newRecord = {
            id: mockAttendance.length + 1,
            employeeId,
            date: new Date().toISOString().split('T')[0],
            clockIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            clockOut: null,
            status: 'Present',
            workHours: '0.0',
        };
        mockAttendance.push(newRecord);
        return newRecord;
    },

    clockOut: async (id) => {
        await delay(500);
        const index = mockAttendance.findIndex(item => item.id === id);
        if (index !== -1) {
            mockAttendance[index].clockOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            // Simplified work hours calculation
            mockAttendance[index].workHours = '8.5';
            return mockAttendance[index];
        }
        throw new Error('Attendance record not found');
    }
};
