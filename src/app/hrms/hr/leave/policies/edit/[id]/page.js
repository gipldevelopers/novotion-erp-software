"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import PolicyForm from '../../comopnents/PolicyForm';

// Mock data for leave policies
const initialPolicies = [
  {
    id: 1,
    name: "Annual Leave Policy",
    description: "Standard annual leave policy for all employees",
    effectiveDate: "2023-01-01",
    status: "active",
    applicableTo: "all_employees",
    accrualMethod: "monthly",
    maxAccrual: 21,
    carryOverLimit: 5,
    encashment: true,
    requiresApproval: true,
    attachmentRequired: false,
    minServicePeriod: 6,
    maxConsecutiveDays: 14,
    advanceNoticeDays: 7,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  // ... other policies
];

export default function EditPolicy() {
  const router = useRouter();
  const params = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the policy data from an API
    const policyId = parseInt(params.id);
    const foundPolicy = initialPolicies.find(item => item.id === policyId);
    
    if (foundPolicy) {
      setPolicy(foundPolicy);
    }
    
    setLoading(false);
  }, [params.id]);

  const handleSave = (formData) => {
    // Here you would typically send the updated data to your API
    console.log('Updating policy:', formData);
    
    // For now, just redirect back to the policies page
    router.push('/hr/leave/policies');
  };

  const handleCancel = () => {
    router.push('/hr/leave/policies');
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

//   if (!policy) {
//     return (
//       <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
//         <Breadcrumb
//           pages={[
//             { name: 'HR', href: '/hr' },
//             { name: 'Leave', href: '/hr/leave' },
//             { name: 'Policies', href: '/hr/leave/policies' },
//             { name: 'Edit Policy', href: '#' },
//           ]}
//         />
        
//         <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//             Policy Not Found
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400 mt-2">
//             The requested policy could not be found.
//           </p>
//           <button
//             onClick={() => router.push('/hr/leave/policies')}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Back to Policies
//           </button>
//         </div>
//       </div>
//     );
//   }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
      <Breadcrumb
        pages={[
          { name: 'HR', href: '/hr' },
          { name: 'Leave', href: '/hr/leave' },
          { name: 'Policies', href: '/hr/leave/policies' },
          { name: 'Edit Policy', href: '#' },
        ]}
      />
      
      <div className="mt-6">
        <PolicyForm 
          initialData={policy}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}