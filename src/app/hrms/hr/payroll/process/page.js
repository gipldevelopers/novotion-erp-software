// src/app/(dashboard)/hr/payroll/process/page.js
"use client";
import { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import PayrollProcessForm from './components/PayrollProcessForm';
import EmployeeSelectionTable from './components/EmployeeSelectionTable';
import PayrollSummary from './components/PayrollSummary';

export default function ProcessPayroll() {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState({
    payrollPeriod: '',
    paymentDate: '',
    notes: ''
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleEmployeeSelection = (employees) => {
    setSelectedEmployees(employees);
  };

  const handlePayrollDataChange = (data) => {
    setPayrollData(data);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleProcessPayroll = () => {
    // This would be where you process the payroll
    console.log('Processing payroll with data:', {
      payrollData,
      selectedEmployees
    });
    alert('Payroll processed successfully!');
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb
        pageTitle="Process Payroll"
        rightContent={null}
      />

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              1
            </div>
            <div className={`ml-2 text-sm font-medium ${currentStep >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
              Select Period
            </div>
          </div>
          
          <div className={`flex-auto border-t-2 mx-4 ${currentStep >= 2 ? 'border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              2
            </div>
            <div className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
              Select Employees
            </div>
          </div>
          
          <div className={`flex-auto border-t-2 mx-4 ${currentStep >= 3 ? 'border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              3
            </div>
            <div className={`ml-2 text-sm font-medium ${currentStep >= 3 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
              Review & Process
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
        {currentStep === 1 && (
          <PayrollProcessForm 
            payrollData={payrollData}
            onChange={handlePayrollDataChange}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 2 && (
          <EmployeeSelectionTable 
            selectedEmployees={selectedEmployees}
            onChange={handleEmployeeSelection}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 3 && (
          <PayrollSummary 
            payrollData={payrollData}
            selectedEmployees={selectedEmployees}
            onProcess={handleProcessPayroll}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  );
}