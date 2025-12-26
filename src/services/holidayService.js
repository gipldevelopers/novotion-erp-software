import { mockHolidays } from './mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const holidayService = {
    getAllHolidays: async () => {
        await delay();
        return [...mockHolidays];
    }
};

export default holidayService;
