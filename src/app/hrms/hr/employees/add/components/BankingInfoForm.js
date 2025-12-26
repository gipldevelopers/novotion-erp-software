// "use client";
// import { CreditCard, Building, User, Scan, Banknote, CheckCircle, MapPin } from 'lucide-react';
// import InputField from '@/components/form/input/InputField';
// import SelectField from './SelectField';
// import Label from '@/components/form/Label';

// export default function BankingInfoForm({ formData, errors, onChange }) {
//   const bankOptions = [
//     { value: '', label: 'Select Bank' },
//     { value: 'sbi', label: 'State Bank of India (SBI)' },
//     { value: 'hdfc', label: 'HDFC Bank' },
//     { value: 'icici', label: 'ICICI Bank' },
//     { value: 'axis', label: 'Axis Bank' },
//     { value: 'kotak', label: 'Kotak Mahindra Bank' },
//     { value: 'yes', label: 'Yes Bank' },
//     { value: 'indusind', label: 'IndusInd Bank' },
//     { value: 'bob', label: 'Bank of Baroda' },
//     { value: 'canara', label: 'Canara Bank' },
//     { value: 'pnb', label: 'Punjab National Bank (PNB)' },
//     { value: 'idfc', label: 'IDFC First Bank' },
//     { value: 'rbl', label: 'RBL Bank' },
//     { value: 'other', label: 'Other Bank' }
//   ];

//   const accountTypeOptions = [
//     { value: '', label: 'Select Account Type' },
//     { value: 'savings', label: 'Savings Account' },
//     { value: 'current', label: 'Current Account' },
//     { value: 'salary', label: 'Salary Account' },
//     { value: 'nre', label: 'NRE Account' },
//     { value: 'nro', label: 'NRO Account' }
//   ];

//   // Function to validate IFSC code format
//   const validateIFSC = (ifsc) => {
//     const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//     return ifscRegex.test(ifsc);
//   };

//   const handleIFSCChange = (value) => {
//     onChange('ifscCode', value.toUpperCase());

//     // Auto-fetch bank details if IFSC is valid
//     if (validateIFSC(value) && value.length === 11) {
//       // Simulate bank details fetch based on IFSC
//       const bankPrefix = value.substring(0, 4);
//       const bankName = getBankNameFromIFSC(bankPrefix);
//       if (bankName) {
//         onChange('bankName', bankName);
//       }
//     }
//   };

//   // Helper function to get bank name from IFSC prefix
//   const getBankNameFromIFSC = (prefix) => {
//     const bankMap = {
//       'SBIN': 'State Bank of India (SBI)',
//       'HDFC': 'HDFC Bank',
//       'ICIC': 'ICICI Bank',
//       'UTIB': 'Axis Bank',
//       'KKBK': 'Kotak Mahindra Bank',
//       'YESB': 'Yes Bank',
//       'INDB': 'IndusInd Bank',
//       'BARB': 'Bank of Baroda',
//       'CNRB': 'Canara Bank',
//       'PUNB': 'Punjab National Bank (PNB)',
//       'IDFB': 'IDFC First Bank',
//       'RATN': 'RBL Bank'
//     };
//     return bankMap[prefix] || '';
//   };

//   // Function to validate account number
//   const validateAccountNumber = (accountNumber) => {
//     return /^\d{9,18}$/.test(accountNumber); // Account numbers typically between 9-18 digits
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
//             <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//               Banking Information
//             </h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//               Enter the employee's bank account details for payroll processing
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Bank Account Details */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
//         <div className="flex items-center gap-2 mb-6">
//           <Banknote className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//           <h3 className="font-medium text-gray-900 dark:text-white">
//             Bank Account Details
//           </h3>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Bank Name */}
//           <div className="space-y-2">
//             <Label htmlFor="bankName" required>
//               Bank Name
//             </Label>
//             <SelectField
//               id="bankName"
//               name="bankName"
//               value={formData.bankName}
//               onChange={(value) => onChange('bankName', value)}
//               options={bankOptions}
//               error={errors.bankName}
//               icon={<Building className="w-4 h-4" />}
//             />
//           </div>

//           {/* Account Number */}
//           <div className="space-y-2">
//             <Label htmlFor="accountNumber" required>
//               Account Number
//             </Label>
//             <InputField
//               id="accountNumber"
//               name="accountNumber"
//               value={formData.accountNumber}
//               onChange={(e) => onChange('accountNumber', e.target.value.replace(/\D/g, ''))}
//               placeholder="Enter account number"
//               error={errors.accountNumber}
//               icon={<CreditCard className="w-4 h-4" />}
//               maxLength={18}
//               onBlur={(e) => {
//                 if (!validateAccountNumber(e.target.value)) {
//                   // This would need to be handled through your error state management
//                   console.error('Please enter a valid account number (9-18 digits)');
//                 }
//               }}
//             />
//           </div>

//           {/* IFSC Code */}
//           <div className="space-y-2">
//             <Label htmlFor="ifscCode" required>
//               IFSC Code
//             </Label>
//             <InputField
//               id="ifscCode"
//               name="ifscCode"
//               value={formData.ifscCode}
//               onChange={(e) => handleIFSCChange(e.target.value)}
//               placeholder="Enter IFSC code"
//               error={errors.ifscCode}
//               icon={<Scan className="w-4 h-4" />}
//               maxLength={11}
//               className="uppercase"
//               onBlur={(e) => {
//                 if (!validateIFSC(e.target.value)) {
//                   // This would need to be handled through your error state management
//                   console.error('Please enter a valid IFSC code (e.g., SBIN0000123)');
//                 }
//               }}
//             />
//           </div>

//           {/* Account Holder Name */}
//           <div className="space-y-2">
//             <Label htmlFor="accountHolderName" required>
//               Account Holder Name
//             </Label>
//             <InputField
//               id="accountHolderName"
//               name="accountHolderName"
//               value={formData.accountHolderName}
//               onChange={(e) => onChange('accountHolderName', e.target.value)}
//               placeholder="Enter account holder name"
//               error={errors.accountHolderName}
//               icon={<User className="w-4 h-4" />}
//             />
//           </div>

//           {/* Branch Name */}
//           <div className="space-y-2">
//             <Label htmlFor="branchName">
//               Branch Name
//             </Label>
//             <InputField
//               id="branchName"
//               name="branchName"
//               value={formData.branchName}
//               onChange={(e) => onChange('branchName', e.target.value)}
//               placeholder="Enter branch name"
//               error={errors.branchName}
//               icon={<MapPin className="w-4 h-4" />}
//             />
//           </div>

//           {/* Account Type */}
//           <div className="space-y-2">
//             <Label htmlFor="accountType">
//               Account Type
//             </Label>
//             <SelectField
//               id="accountType"
//               name="accountType"
//               value={formData.accountType}
//               onChange={(value) => onChange('accountType', value)}
//               options={accountTypeOptions}
//               error={errors.accountType}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Account Verification */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
//         <div className="flex items-center gap-2 mb-6">
//           <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//           <h3 className="font-medium text-gray-900 dark:text-white">
//             Account Verification
//           </h3>
//         </div>

//         <div className="space-y-4">
//           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//             <div className="flex items-start gap-3">
//               <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
//                 <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
//                   Bank Account Verification
//                 </p>
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
//                     <input
//                       type="checkbox"
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                     I verify that the bank account details provided are correct
//                   </label>
//                   <label className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
//                     <input
//                       type="checkbox"
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                     I have cross-checked the account number and IFSC code
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* IFSC Helper */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
//         <div className="flex items-center gap-2 mb-6">
//           <Scan className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//           <h3 className="font-medium text-gray-900 dark:text-white">
//             IFSC Code Information
//           </h3>
//         </div>

//         <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
//           <div className="flex items-start gap-3">
//             <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded">
//               <Scan className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
//                 IFSC Code Examples
//               </p>
//               <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
//                 <p>SBIN0000123 - State Bank of India</p>
//                 <p>HDFC0000123 - HDFC Bank</p>
//                 <p>ICIC0000123 - ICICI Bank</p>
//                 <p>UTIB0000123 - Axis Bank</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Info Card */}
//       <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
//         <div className="flex items-start gap-3">
//           <div className="p-1.5 bg-indigo-600 rounded-md flex-shrink-0 mt-0.5">
//             <CreditCard className="w-4 h-4 text-white" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
//               Banking Information Guidelines
//             </p>
//             <ul className="text-xs text-indigo-700 dark:text-indigo-300 mt-1 space-y-1">
//               <li>• Ensure account number matches the bank passbook</li>
//               <li>• IFSC code must be exactly 11 characters</li>
//               <li>• Account holder name should match the employee's name</li>
//               <li>• Double-check details to avoid payroll processing errors</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { CreditCard, Building, User, Scan, Banknote, MapPin } from 'lucide-react';
import InputField from '@/app/hrms/components/form/input/InputField';
import SelectField from './SelectField';
import Label from '@/app/hrms/components/form/Label';

export default function BankingInfoForm({ formData, errors, onChange }) {
  const accountTypeOptions = [
    { value: '', label: 'Select Account Type' },
    { value: 'SAVINGS', label: 'Savings Account' },
    { value: 'CURRENT', label: 'Current Account' },
    { value: 'SALARY', label: 'Salary Account' },
    { value: 'NRE', label: 'NRE Account' },
    { value: 'NRO', label: 'NRO Account' }
  ];

  // Function to format IFSC code to uppercase
  const handleIFSCChange = (value) => {
    onChange('ifscCode', value.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Banking Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enter the employee's bank account details for payroll processing
            </p>
          </div>
        </div>
      </div>

      {/* Bank Account Details */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Banknote className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Bank Account Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName">
              Bank Name
            </Label>
            <InputField
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={(e) => onChange('bankName', e.target.value)}
              placeholder="Enter bank name"
              error={errors.bankName}
              icon={<Building className="w-4 h-4" />}
            />
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">
              Account Number
            </Label>
            <InputField
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => onChange('accountNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="Enter account number"
              error={errors.accountNumber}
              icon={<CreditCard className="w-4 h-4" />}
              maxLength={18}
            />
          </div>

          {/* IFSC Code */}
          <div className="space-y-2">
            <Label htmlFor="ifscCode">
              IFSC Code
            </Label>
            <InputField
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={(e) => handleIFSCChange(e.target.value)}
              placeholder="Enter IFSC code"
              error={errors.ifscCode}
              icon={<Scan className="w-4 h-4" />}
              maxLength={11}
              className="uppercase"
            />
          </div>

          {/* Account Holder Name */}
          <div className="space-y-2">
            <Label htmlFor="accountHolderName">
              Account Holder Name
            </Label>
            <InputField
              id="accountHolderName"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={(e) => onChange('accountHolderName', e.target.value)}
              placeholder="Enter account holder name"
              error={errors.accountHolderName}
              icon={<User className="w-4 h-4" />}
            />
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label htmlFor="accountType">
              Account Type
            </Label>
            <SelectField
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={(value) => onChange('accountType', value)}
              options={accountTypeOptions}
              error={errors.accountType}
            />
          </div>
        </div>
      </div>

      {/* Tax & Document Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Scan className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Tax & Document Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PAN Number */}
          <div className="space-y-2">
            <Label htmlFor="panNumber">
              PAN Number
            </Label>
            <InputField
              id="panNumber"
              name="panNumber"
              value={formData.panNumber}
              onChange={(e) => onChange('panNumber', e.target.value.toUpperCase())}
              placeholder="Enter PAN number"
              error={errors.panNumber}
              maxLength={10}
              className="uppercase"
            />
          </div>

          {/* Aadhaar Number */}
          <div className="space-y-2">
            <Label htmlFor="aadhaarNumber">
              Aadhaar Number
            </Label>
            <InputField
              id="aadhaarNumber"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={(e) => onChange('aadhaarNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="Enter Aadhaar number"
              error={errors.aadhaarNumber}
              maxLength={12}
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-indigo-600 rounded-md flex-shrink-0 mt-0.5">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
              Banking Information Guidelines
            </p>
            <ul className="text-xs text-indigo-700 dark:text-indigo-300 mt-1 space-y-1">
              <li>• All fields are optional but recommended for payroll processing</li>
              <li>• Ensure account number matches the bank passbook</li>
              <li>• IFSC code must be exactly 11 characters</li>
              <li>• Account holder name should match the employee's name</li>
              <li>• PAN and Aadhaar are required for tax compliance</li>
              <li>• Double-check details to avoid payroll processing errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}