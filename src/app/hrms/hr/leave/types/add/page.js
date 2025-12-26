// "use client";
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Breadcrumb from '@/components/common/Breadcrumb';
// import LeaveTypeForm from '../../components/LeaveTypeForm';

// export default function AddLeaveType() {
//   const router = useRouter();

//   const handleSave = (formData) => {
//     // Here you would typically send the data to your API
//     console.log('Saving leave type:', formData);
    
//     // For now, just redirect back to the leave types page
//     router.push('/hr/leave/types');
//   };

//   const handleCancel = () => {
//     router.push('/hr/leave/types');
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
//       <Breadcrumb
//         pages={[
//           { name: 'HR', href: '/hr' },
//           { name: 'Leave', href: '/hr/leave' },
//           { name: 'Leave Types', href: '/hr/leave/types' },
//           { name: 'Add Leave Type', href: '#' },
//         ]}
//       />
      
//       <div className="mt-6">
//         <LeaveTypeForm 
//           onSave={handleSave}
//           onCancel={handleCancel}
//         />
//       </div>
//     </div>
//   );
// }

// src/app/(dashboard)/hr/leave/types/add/page.js
// "use client";
// import Breadcrumb from '@/components/common/Breadcrumb';
// import LeaveTypeForm from '../../components/LeaveTypeForm';

// export default function AddLeaveTypePage() {
//   return (
//     <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
//       {/* Breadcrumb */}
//       <Breadcrumb rightContent={null} />
      
//       <div className="bg-white rounded-lg shadow dark:bg-gray-800">
//         <LeaveTypeForm />
//       </div>
//     </div>
//   );
// }

// src/app/(dashboard)/hr/leave/types/add/page.js
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import LeaveTypeForm from '../../components/LeaveTypeForm';
import { leaveTypeService } from '@/services/leaveTypeService';
import { toast } from 'sonner';

export default function AddLeaveType() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      await leaveTypeService.createLeaveType(formData);
      toast.success('Leave type created successfully');
      router.push('/hr/leave/types');
      router.refresh();
    } catch (error) {
      console.error('Error creating leave type:', error);
      toast.error(error.message || 'Failed to create leave type');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/hr/leave/types');
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
      <Breadcrumb
        pages={[
          { name: 'HR', href: '/hr' },
          { name: 'Leave', href: '/hr/leave' },
          { name: 'Leave Types', href: '/hr/leave/types' },
          { name: 'Add Leave Type', href: '#' },
        ]}
      />
      
      <div className="mt-6">
        <LeaveTypeForm 
          onSave={handleSave}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}