// src/app/(dashboard)/hr/payroll/tax-settings/page.js
"use client";
import { useState } from 'react';
import { Save, Download, Upload } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import TaxConfigForm from './components/TaxConfigForm';
import TaxBracketsTable from './components/TaxBracketsTable';
import TaxExemptionsList from './components/TaxExemptionsList';

export default function TaxSettings() {
  const [activeTab, setActiveTab] = useState('configuration');
  const [taxConfig, setTaxConfig] = useState({
    taxYear: '2024',
    taxMethod: 'progressive',
    defaultAllowance: 12500,
    socialSecurityRate: 6.2,
    medicareRate: 1.45,
    additionalMedicareRate: 0.9,
    additionalMedicareThreshold: 200000,
    stateTaxRate: 5.0,
    unemploymentInsuranceRate: 0.6
  });

  const handleSaveSettings = () => {
    console.log('Saving tax settings:', taxConfig);
    // In a real app, this would save to the backend
    alert('Tax settings saved successfully!');
  };

  const handleExportSettings = () => {
    console.log('Exporting tax settings');
    // In a real app, this would export the settings
    alert('Tax settings exported successfully!');
  };

  const handleImportSettings = () => {
    console.log('Importing tax settings');
    // In a real app, this would import settings from a file
    alert('Tax settings imported successfully!');
  };

  const tabs = [
    { id: 'configuration', name: 'Configuration' },
    { id: 'brackets', name: 'Tax Brackets' },
    { id: 'exemptions', name: 'Exemptions' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb
        pageTitle="Tax Settings"
        rightContent={
          <div className="flex gap-3">
            <button
              onClick={handleImportSettings}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <Upload size={18} />
              Import
            </button>
            <button
              onClick={handleExportSettings}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={handleSaveSettings}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
            >
              <Save size={18} />
              Save Settings
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mt-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'configuration' && (
            <TaxConfigForm 
              taxConfig={taxConfig} 
              setTaxConfig={setTaxConfig} 
            />
          )}
          
          {activeTab === 'brackets' && (
            <TaxBracketsTable />
          )}
          
          {activeTab === 'exemptions' && (
            <TaxExemptionsList />
          )}
        </div>
      </div>
    </div>
  );
}