// "use client";
// import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

// export default function FormNavigation({
//   currentStep,
//   totalSteps,
//   onPrevious,
//   onNext,
//   onSubmit,
//   isSubmitting,
//   canProceed = true,
//   submitButtonText = "Create Employee" // Default value
// }) {
//   return (
//     <div className="flex items-center justify-between">
//       <div>
//         {currentStep > 1 && (
//           <button
//             type="button"
//             onClick={onPrevious}
//             className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//             disabled={isSubmitting}
//           >
//             <ChevronLeft className="w-4 h-4" />
//             Previous
//           </button>
//         )}
//       </div>

//       <div className="flex items-center gap-3">
//         {currentStep < totalSteps ? (
//           <button
//             type="button"
//             onClick={onNext}
//             disabled={!canProceed || isSubmitting}
//             className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
//               canProceed && !isSubmitting
//                 ? 'bg-blue-600 text-white hover:bg-blue-700'
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
//             }`}
//           >
//             Next
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         ) : (
//           <button
//             type="button"
//             onClick={onSubmit}
//             disabled={!canProceed || isSubmitting}
//             className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
//               canProceed && !isSubmitting
//                 ? 'bg-green-600 text-white hover:bg-green-700'
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="w-4 h-4" />
//                 Save Employee
//               </>
//             )}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

export default function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  canProceed = true,
  submitButtonText = "Create Employee" // Default value
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onPrevious}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              canProceed && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              canProceed && !isSubmitting
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {submitButtonText}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}