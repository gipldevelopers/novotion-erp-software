// "use client";
// import { Upload, FileText, X, Eye, CheckCircle, User, FileCheck } from 'lucide-react';
// import { useState } from 'react';
// import Label from '@/components/form/Label';
// import { toast } from 'sonner';
// import { useParams } from 'next/navigation';

// // export default function DocumentsForm({ formData, errors, onChange, employeeId }) {
// export default function DocumentsForm() {
//   const [uploadedFiles, setUploadedFiles] = useState({
//     aadhaar: null,
//     pan: null,
//     resume: null,
//     education: []
//   });

//   const [isUploading, setIsUploading] = useState(false);
//   const params = useParams(); // Get URL params
//   const employeeId = params.id; // Extract employeeId from URL

//   const handleFileUpload = async (field, file, documentType) => {
//     if (!employeeId) {
//       toast.error('Please create the employee first before uploading documents');
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       toast.error('File size must be less than 10MB');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setUploadedFiles(prev => ({
//         ...prev,
//         [field]: {
//           file,
//           preview: reader.result,
//           name: file.name,
//           size: file.size,
//           type: file.type,
//           documentType
//         }
//       }));
//     };
//     reader.readAsDataURL(file);

//     // Upload the file immediately
//     await uploadDocument(file, documentType);
//   };

//   const uploadDocument = async (file, type) => {
//     if (!employeeId) return;

//     setIsUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('name', `${type} Document`);
//       formData.append('type', type);
//       formData.append('description', `Uploaded ${type} document for employee`);

//       // This would call your employeeService.uploadDocument method
//       // For now, we'll simulate the upload
//       console.log('Uploading document:', { type, fileName: file.name });

//       // Simulate upload delay
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       toast.success(`${type} document uploaded successfully!`);
//     } catch (error) {
//       console.error('Error uploading document:', error);
//       toast.error(`Failed to upload ${type} document`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const removeFile = (field) => {
//     setUploadedFiles(prev => ({
//       ...prev,
//       [field]: null
//     }));
//     // Note: In a real app, you might want to call an API to delete the document
//   };

//   const handleEducationUpload = (files) => {
//     if (!employeeId) {
//       toast.error('Please create the employee first before uploading documents');
//       return;
//     }

//     const newFiles = Array.from(files).slice(0, 5 - uploadedFiles.education.length); // Max 5 files
//     newFiles.forEach(file => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const educationFile = {
//           file,
//           preview: reader.result,
//           name: file.name,
//           size: file.size,
//           type: file.type,
//           documentType: 'EDUCATION'
//         };

//         setUploadedFiles(prev => ({
//           ...prev,
//           education: [...prev.education, educationFile]
//         }));

//         uploadDocument(file, 'EDUCATION');
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeEducationFile = (index) => {
//     const updatedFiles = uploadedFiles.education.filter((_, i) => i !== index);
//     setUploadedFiles(prev => ({
//       ...prev,
//       education: updatedFiles
//     }));
//   };

//   const FileUploadField = ({ label, field, accept, description, documentType }) => (
//     <div className="space-y-3">
//       <Label htmlFor={field}>
//         {label}
//       </Label>

//       {uploadedFiles[field] ? (
//         <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
//           <div className="flex items-center gap-3">
//             <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
//             <div>
//               <p className="text-sm font-medium text-green-900 dark:text-green-100">
//                 {uploadedFiles[field].name}
//               </p>
//               <p className="text-xs text-green-700 dark:text-green-300">
//                 {(uploadedFiles[field].size / 1024 / 1024).toFixed(2)} MB
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={() => window.open(uploadedFiles[field].preview, '_blank')}
//               className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
//             >
//               <Eye className="w-4 h-4" />
//             </button>
//             <button
//               type="button"
//               onClick={() => removeFile(field)}
//               className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       ) : (
//         <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
//           <Upload className="w-8 h-8 text-gray-400 mb-2" />
//           <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
//             Click to upload or drag and drop
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//             {description || 'PDF, JPG, PNG up to 10MB'}
//           </p>
//           <input
//             type="file"
//             id={field}
//             className="hidden"
//             accept={accept}
//             onChange={(e) => e.target.files[0] && handleFileUpload(field, e.target.files[0], documentType)}
//             disabled={!employeeId || isUploading}
//           />
//         </label>
//       )}
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
//             <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//               Documents & Verification
//             </h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//               Upload required documents for employee verification
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* {!employeeId && (
//         <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <FileCheck className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
//             <div>
//               <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
//                 Employee must be created first
//               </p>
//               <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
//                 Documents can be uploaded after the employee profile is created. Click "Create Employee" to proceed.
//               </p>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {/* Document Uploads */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
//         <div className="flex items-center gap-2 mb-6">
//           <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//           <h3 className="font-medium text-gray-900 dark:text-white">
//             Required Documents
//           </h3>
//         </div>

//         <div className="grid grid-cols-1 gap-6">
//           {/* Aadhaar Card */}
//           <FileUploadField
//             label="Aadhaar Card"
//             field="aadhaar"
//             accept=".pdf,.jpg,.jpeg,.png"
//             description="Front or back side of Aadhaar card"
//             documentType="AADHAAR"
//           />

//           {/* PAN Card */}
//           <FileUploadField
//             label="PAN Card"
//             field="pan"
//             accept=".pdf,.jpg,.jpeg,.png"
//             documentType="PAN"
//           />

//           {/* Resume/CV */}
//           <FileUploadField
//             label="Resume/CV"
//             field="resume"
//             accept=".pdf,.doc,.docx"
//             description="PDF or Word document"
//             documentType="RESUME"
//           />

//           {/* Education Certificates */}
//           <div className="space-y-3">
//             <Label htmlFor="educationCertificates">
//               Education Certificates (Max 5)
//             </Label>

//             {uploadedFiles.education.length > 0 && (
//               <div className="space-y-2">
//                 {uploadedFiles.education.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
//                     <div className="flex items-center gap-3">
//                       <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                       <div>
//                         <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
//                           {file.name}
//                         </p>
//                         <p className="text-xs text-blue-700 dark:text-blue-300">
//                           {(file.size / 1024 / 1024).toFixed(2)} MB
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeEducationFile(index)}
//                       className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {uploadedFiles.education.length < 5 && (
//               <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
//                 <Upload className="w-6 h-6 text-gray-400 mb-1" />
//                 <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
//                   Add education certificates
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//                   PDF, JPG, PNG up to 10MB each
//                 </p>
//                 <input
//                   type="file"
//                   id="educationCertificates"
//                   className="hidden"
//                   accept=".pdf,.jpg,.jpeg,.png"
//                   multiple
//                   onChange={(e) => handleEducationUpload(e.target.files)}
//                   disabled={!employeeId || isUploading}
//                 />
//               </label>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Info Card */}
//       <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
//         <div className="flex items-start gap-3">
//           <div className="p-1.5 bg-orange-600 rounded-md flex-shrink-0 mt-0.5">
//             <FileText className="w-4 h-4 text-white" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
//               Document Upload Guidelines
//             </p>
//             <ul className="text-xs text-orange-700 dark:text-orange-300 mt-1 space-y-1">
//               <li>• Documents are uploaded after employee creation</li>
//               <li>• Maximum file size: 10MB per document</li>
//               <li>• Accepted formats: PDF, JPG, JPEG, PNG, DOC, DOCX</li>
//               <li>• Ensure documents are clear and readable</li>
//               <li>• Documents are automatically saved when uploaded</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {isUploading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
//             <div className="flex items-center gap-3">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//               <p className="text-gray-700 dark:text-gray-300">Uploading document...</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { Upload, FileText, X, Eye, CheckCircle, User, FileCheck, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import Label from '@/app/hrms/components/form/Label';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import employeeService from '@/services/employeeService';

export default function EmployeeDocumentsPage() {
  const [uploadedFiles, setUploadedFiles] = useState({
    aadhaar: null,
    pan: null,
    resume: null,
    education: []
  });
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const employeeId = params.id;

  // Load existing documents on page load
  useEffect(() => {
    if (employeeId) {
      loadExistingDocuments();
    }
  }, [employeeId]);

  const loadExistingDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await employeeService.getEmployeeDocuments(employeeId);
      setExistingDocuments(response.data);

      // Pre-populate uploaded files from existing documents
      const filesState = { aadhaar: null, pan: null, resume: null, education: [] };

      response.data.forEach(doc => {
        if (doc.type === 'AADHAAR') filesState.aadhaar = { ...doc, isExisting: true };
        else if (doc.type === 'PAN') filesState.pan = { ...doc, isExisting: true };
        else if (doc.type === 'RESUME') filesState.resume = { ...doc, isExisting: true };
        else if (doc.type === 'EDUCATION') filesState.education.push({ ...doc, isExisting: true });
      });

      setUploadedFiles(filesState);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load existing documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (field, file, documentType) => {
    if (!employeeId) {
      toast.error('Employee ID is required');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFiles(prev => ({
        ...prev,
        [field]: field === 'education'
          ? [...prev[field], { file, preview: reader.result, name: file.name, size: file.size, type: file.type, documentType }]
          : { file, preview: reader.result, name: file.name, size: file.size, type: file.type, documentType }
      }));
    };
    reader.readAsDataURL(file);
  };

  const uploadDocument = async (fileData, type) => {
    if (!employeeId) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileData.file);
      formData.append('name', `${type} Document - ${fileData.name}`);
      formData.append('type', type);
      formData.append('description', `Uploaded ${type} document for employee`);

      const response = await employeeService.uploadDocument(employeeId, formData);

      toast.success(`${type} document uploaded successfully!`);
      await loadExistingDocuments(); // Reload documents after upload

      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(`Failed to upload ${type} document: ${error.message}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadAll = async () => {
    if (!employeeId) {
      toast.error('Employee ID is required');
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = [];

      // Upload individual documents
      if (uploadedFiles.aadhaar && !uploadedFiles.aadhaar.isExisting) {
        uploadPromises.push(uploadDocument(uploadedFiles.aadhaar, 'AADHAAR'));
      }
      if (uploadedFiles.pan && !uploadedFiles.pan.isExisting) {
        uploadPromises.push(uploadDocument(uploadedFiles.pan, 'PAN'));
      }
      if (uploadedFiles.resume && !uploadedFiles.resume.isExisting) {
        uploadPromises.push(uploadDocument(uploadedFiles.resume, 'RESUME'));
      }

      // Upload education documents
      uploadedFiles.education.forEach(edu => {
        if (!edu.isExisting) {
          uploadPromises.push(uploadDocument(edu, 'EDUCATION'));
        }
      });

      await Promise.all(uploadPromises);
      toast.success('All documents uploaded successfully!');

      // Clear selected files after successful upload
      setUploadedFiles(prev => ({
        aadhaar: prev.aadhaar?.isExisting ? prev.aadhaar : null,
        pan: prev.pan?.isExisting ? prev.pan : null,
        resume: prev.resume?.isExisting ? prev.resume : null,
        education: prev.education.filter(edu => edu.isExisting)
      }));

    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Failed to upload some documents');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (field, index = null) => {
    if (index !== null) {
      // Remove education file by index
      setUploadedFiles(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    } else {
      // Remove single file
      setUploadedFiles(prev => ({ ...prev, [field]: null }));
    }
  };

  const downloadDocument = async (documentId, fileName) => {
    try {
      const response = await employeeService.downloadDocument(documentId);
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const deleteDocument = async (documentId, documentType) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await employeeService.deleteDocument(documentId);
      toast.success('Document deleted successfully');
      await loadExistingDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const FileUploadField = ({ label, field, accept, description, documentType, multiple = false }) => (
    <div className="space-y-3">
      <Label htmlFor={field}>
        {label}
        <span className="text-red-500 ml-1">*</span>
      </Label>

      {/* Existing Document */}
      {uploadedFiles[field]?.isExisting ? (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                {uploadedFiles[field].name}
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Uploaded on {new Date(uploadedFiles[field].uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadDocument(uploadedFiles[field].id, uploadedFiles[field].name)}
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => deleteDocument(uploadedFiles[field].id, documentType)}
              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              title="Delete"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : uploadedFiles[field] ? (
        /* Newly selected file */
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {uploadedFiles[field].name}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {(uploadedFiles[field].size / 1024 / 1024).toFixed(2)} MB - Ready to upload
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeFile(field)}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Upload field */
        <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {description || 'PDF, JPG, PNG up to 10MB'}
          </p>
          <input
            type="file"
            id={field}
            className="hidden"
            accept={accept}
            onChange={(e) => e.target.files[0] && handleFileSelect(field, e.target.files[0], documentType)}
            disabled={isUploading}
            multiple={multiple}
          />
        </label>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hasFilesToUpload = uploadedFiles.aadhaar && !uploadedFiles.aadhaar.isExisting ||
    uploadedFiles.pan && !uploadedFiles.pan.isExisting ||
    uploadedFiles.resume && !uploadedFiles.resume.isExisting ||
    uploadedFiles.education.some(edu => !edu.isExisting);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Employee Documents
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Upload and manage required documents for employee #{employeeId}
            </p>
          </div>
        </div>
      </div>

      {/* Document Uploads */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Required Documents
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FileUploadField
            label="Aadhaar Card"
            field="aadhaar"
            accept=".pdf,.jpg,.jpeg,.png"
            description="Front and back sides of Aadhaar card"
            documentType="AADHAAR"
          />

          <FileUploadField
            label="PAN Card"
            field="pan"
            accept=".pdf,.jpg,.jpeg,.png"
            documentType="PAN"
          />

          <FileUploadField
            label="Resume/CV"
            field="resume"
            accept=".pdf,.doc,.docx"
            description="PDF or Word document"
            documentType="RESUME"
          />

          {/* Education Certificates */}
          <div className="space-y-3">
            <Label htmlFor="educationCertificates">
              Education Certificates (Max 5)
            </Label>

            {uploadedFiles.education.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {file.name}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {file.isExisting
                        ? `Uploaded on ${new Date(file.uploadedAt).toLocaleDateString()}`
                        : `${(file.size / 1024 / 1024).toFixed(2)} MB - Ready to upload`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.isExisting ? (
                    <>
                      <button
                        onClick={() => downloadDocument(file.id, file.name)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDocument(file.id, 'EDUCATION')}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => removeFile('education', index)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {uploadedFiles.education.length < 5 && (
              <FileUploadField
                label="Add Education Certificate"
                field="education"
                accept=".pdf,.jpg,.jpeg,.png"
                documentType="EDUCATION"
                multiple={true}
              />
            )}
          </div>
        </div>

        {/* Upload Button */}
        {hasFilesToUpload && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleUploadAll}
              disabled={isUploading}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload All Documents
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Compliance Status */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Document Compliance Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['AADHAAR', 'PAN', 'RESUME', 'EDUCATION'].map((type) => (
            <div key={type} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`p-1 rounded-full ${existingDocuments.some(doc => doc.type === type)
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                {existingDocuments.some(doc => doc.type === type) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <FileCheck className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {type}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {existingDocuments.some(doc => doc.type === type) ? 'Uploaded' : 'Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-700 dark:text-gray-300">Uploading documents...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}