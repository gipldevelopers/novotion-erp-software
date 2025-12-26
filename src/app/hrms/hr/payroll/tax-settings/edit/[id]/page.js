// // src/app/(dashboard)/hr/payroll/tax-settings/[id]/page.js
// "use client";
// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import Breadcrumb from '@/components/common/Breadcrumb';
// import TaxBracketForm from '../../components/TaxBracketForm';

// // Mock function to simulate fetching a tax bracket
// const getTaxBracket = async (id) => {
//   // In a real app, this would be an API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const brackets = [
//         { id: 1, minIncome: 0, maxIncome: 10275, rate: 10, description: 'First Bracket' },
//         { id: 2, minIncome: 10276, maxIncome: 41775, rate: 12, description: 'Second Bracket' },
//         { id: 3, minIncome: 41776, maxIncome: 89075, rate: 22, description: 'Third Bracket' },
//         { id: 4, minIncome: 89076, maxIncome: 170050, rate: 24, description: 'Fourth Bracket' },
//         { id: 5, minIncome: 170051, maxIncome: 215950, rate: 32, description: 'Fifth Bracket' },
//         { id: 6, minIncome: 215951, maxIncome: 539900, rate: 35, description: 'Sixth Bracket' },
//         { id: 7, minIncome: 539901, maxIncome: null, rate: 37, description: 'Seventh Bracket' },
//       ];
//       const bracket = brackets.find(b => b.id === parseInt(id));
//       resolve(bracket);
//     }, 500);
//   });
// };

// // Mock function to simulate updating a tax bracket
// const updateTaxBracket = async (id, bracketData) => {
//   // In a real app, this would be an API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log('Updating tax bracket:', id, bracketData);
//       resolve({ success: true });
//     }, 1000);
//   });
// };

// export default function EditTaxBracket() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id;
  
//   const [bracket, setBracket] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchBracket = async () => {
//       try {
//         const bracketData = await getTaxBracket(id);
//         if (bracketData) {
//           setBracket(bracketData);
//         } else {
//           // Redirect if bracket not found
//           router.push('/hr/payroll/tax-settings');
//         }
//       } catch (error) {
//         console.error('Error fetching tax bracket:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBracket();
//   }, [id, router]);

//   const handleSubmit = async (formData) => {
//     setIsSubmitting(true);
//     try {
//       const result = await updateTaxBracket(id, formData);
//       if (result.success) {
//         // Redirect back to tax settings page
//         router.push('/hr/payroll/tax-settings');
//       }
//     } catch (error) {
//       console.error('Error updating tax bracket:', error);
//       throw error;
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     router.push('/hr/payroll/tax-settings');
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-gray-50 min-h-screen dark:bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tax bracket...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!bracket) {
//     return (
//       <div className="bg-gray-50 min-h-screen dark:bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 dark:text-gray-400">Tax bracket not found.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
//       <Breadcrumb
//         pageTitle="Edit Tax Bracket"
//         breadcrumbs={[
//           { name: 'Payroll', path: '/hr/payroll' },
//           { name: 'Tax Settings', path: '/hr/payroll/tax-settings' },
//           { name: 'Edit Tax Bracket', path: `/hr/payroll/tax-settings/${id}` }
//         ]}
//       />
      
//       <div className="mt-6">
//         <TaxBracketForm 
//           bracket={bracket}
//           onSubmit={handleSubmit}
//           onCancel={handleCancel}
//         />
//       </div>
//     </div>
//   );
// }

// src/app/(dashboard)/hr/payroll/tax-settings/edit/[id]/page.js
"use client";
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import TaxBracketForm from '../../components/TaxBracketForm';

// This would typically fetch the tax bracket data from an API
const getTaxBracketData = (id) => {
  // Mock data - replace with actual API call
  const taxBrackets = [
    { id: 1, minIncome: 0, maxIncome: 10275, rate: 10, description: 'First Bracket', status: 'Active' },
    { id: 2, minIncome: 10276, maxIncome: 41775, rate: 12, description: 'Second Bracket', status: 'Active' },
    { id: 3, minIncome: 41776, maxIncome: 89075, rate: 22, description: 'Third Bracket', status: 'Active' },
    { id: 4, minIncome: 89076, maxIncome: 170050, rate: 24, description: 'Fourth Bracket', status: 'Active' },
    { id: 5, minIncome: 170051, maxIncome: 215950, rate: 32, description: 'Fifth Bracket', status: 'Active' },
    { id: 6, minIncome: 215951, maxIncome: 539900, rate: 35, description: 'Sixth Bracket', status: 'Active' },
    { id: 7, minIncome: 539901, maxIncome: null, rate: 37, description: 'Seventh Bracket', status: 'Active' },
  ];
  return taxBrackets.find(bracket => bracket.id === parseInt(id));
};

export default function EditTaxBracketPage() {
  const params = useParams();
  const bracket = getTaxBracketData(params.id);

  if (!bracket) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">Tax bracket not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <TaxBracketForm bracket={bracket} isEdit={true} />
      </div>
    </div>
  );
}