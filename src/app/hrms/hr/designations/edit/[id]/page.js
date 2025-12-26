// "use client";
// import { useParams } from 'next/navigation';
// import Breadcrumb from '@/components/common/Breadcrumb';
// import DesignationForm from '../../components/DesignationForm';

// // This would typically fetch the designation data from an API
// const getDesignationData = (id) => {
//   // Mock data - replace with actual API call
//   const designations = [
//     {
//       id: 1,
//       title: 'Software Engineer',
//       level: 'L2',
//       department: 'Information Technology',
//       minExperience: 2,
//       maxExperience: 5,
//       status: 'Active',
//       description: 'Develop and maintain software applications',
//       responsibilities: 'Write clean, scalable code\nTest and deploy applications\nTroubleshoot and debug applications',
//       requirements: 'Bachelor\'s degree in Computer Science\nProficiency in JavaScript and React\nExperience with REST APIs'
//     },
//     {
//       id: 2,
//       title: 'Senior Software Engineer',
//       level: 'L3',
//       department: 'Information Technology',
//       minExperience: 5,
//       maxExperience: 8,
//       status: 'Active',
//       description: 'Lead development projects and mentor junior engineers',
//       responsibilities: 'Design system architecture\nCode review and quality assurance\nMentor junior team members',
//       requirements: '5+ years of software development experience\nStrong knowledge of system design\nExperience with cloud platforms',
//     },
//     // ... other designations from your table data
//   ];
//   return designations.find(designation => designation.id === parseInt(id));
// };

// export default function EditDesignationPage() {
//   const params = useParams();
//   const designation = getDesignationData(params.id);

//   if (!designation) {
//     return (
//       <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
//         <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6 text-center">
//           <p className="text-gray-600 dark:text-gray-400">Designation not found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
//       {/* Breadcrumb */}
//       <Breadcrumb rightContent={null} />
      
//       <div className="bg-white rounded-lg shadow dark:bg-gray-800">
//         <DesignationForm designation={designation} isEdit={true} />
//       </div>
//     </div>
//   );
// }

// src/app/(dashboard)/hr/designations/edit/[id]/page.js
"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import DesignationForm from '../../components/DesignationForm';
import { designationService } from '@/services/designationService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditDesignationPage() {
  const params = useParams();
  const router = useRouter();
  const [designation, setDesignation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesignation = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      try {
        const designationData = await designationService.getDesignationById(params.id);
        setDesignation(designationData.data);
      } catch (error) {
        console.error('Error fetching designation:', error);
        setError(error.message || 'Failed to fetch designation');
        toast.error(error.message || 'Failed to fetch designation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesignation();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
        <Breadcrumb rightContent={null} />
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading designation...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !designation) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
        <Breadcrumb rightContent={null} />
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'Designation not found'}
          </p>
          <button
            onClick={() => router.push('/hr/designations')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Designations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb rightContent={null} />
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <DesignationForm designation={designation} isEdit={true} />
      </div>
    </div>
  );
}