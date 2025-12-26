// // src/app/(dashboard)/hr/payroll/tax-settings/add/page.js
// "use client";
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Breadcrumb from '@/components/common/Breadcrumb';
// import TaxBracketForm from '../components/TaxBracketForm';

// // Mock function to simulate API call
// const addTaxBracket = async (bracketData) => {
//   // In a real app, this would be an API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log('Adding tax bracket:', bracketData);
//       resolve({ success: true });
//     }, 1000);
//   });
// };

// export default function AddTaxBracket() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (formData) => {
//     setIsSubmitting(true);
//     try {
//       const result = await addTaxBracket(formData);
//       if (result.success) {
//         // Redirect back to tax settings page
//         router.push('/hr/payroll/tax-settings');
//       }
//     } catch (error) {
//       console.error('Error adding tax bracket:', error);
//       throw error;
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     router.push('/hr/payroll/tax-settings');
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
//       <Breadcrumb
//         pageTitle="Add Tax Bracket"
//         breadcrumbs={[
//           { name: 'Payroll', path: '/hr/payroll' },
//           { name: 'Tax Settings', path: '/hr/payroll/tax-settings' },
//           { name: 'Add Tax Bracket', path: '/hr/payroll/tax-settings/add' }
//         ]}
//       />
      
//       <div className="mt-6">
//         <TaxBracketForm 
//           onSubmit={handleSubmit}
//           onCancel={handleCancel}
//         />
//       </div>
//     </div>
//   );
// }

// src/app/(dashboard)/hr/payroll/tax-settings/add/page.js
"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import TaxBracketForm from '../components/TaxBracketForm';

export default function AddTaxBracketPage() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb rightContent={null} />
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <TaxBracketForm />
      </div>
    </div>
  );
}