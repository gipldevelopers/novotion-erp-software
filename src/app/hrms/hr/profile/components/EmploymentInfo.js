// src/app/(dashboard)/hr/profile/components/EmploymentInfo.js
"use client";
import { Calendar, Building, Users } from 'lucide-react';

export default function EmploymentInfo({ data }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Employment Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
              <Users className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Employee ID</p>
              <p className="font-semibold text-gray-800 dark:text-white">{data.employeeId}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
              <Building className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
              <p className="font-semibold text-gray-800 dark:text-white">{data.department}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
              <Building className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Designation</p>
              <p className="font-semibold text-gray-800 dark:text-white">{data.designation}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mr-3">
              <Calendar className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Employment Type</p>
              <p className="font-semibold text-gray-800 dark:text-white">{data.employmentType}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-3">
              <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Joining Date</p>
              <p className="font-semibold text-gray-800 dark:text-white">{data.joiningDate}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg mr-3">
              <Building className="text-pink-600 dark:text-pink-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Work Location</p>
              <p className="font-semibold text-gray-800 dark:text-white">{data.workLocation}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
              <Users className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manager</p>
              <p className="font-semibold text-gray-800 dark:text-white">{data.manager}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}