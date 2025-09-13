'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Upload, X } from 'lucide-react';
import axios from 'axios';
import { useGlobal } from '@/app/Context/context';

// Define props interface for the DocumentUploadModal component
interface DocumentUploadModalProps {
	title?: string;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (uploadData: any) => Promise<void>;
	employee?: {
		id?: number;
		employee_id: string;
		first_name: string;
		last_name: string;
		[key: string]: any;
	};
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
	title = "Upload Document",
	isOpen,
	onClose,
	onSubmit,
	employee
}) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [documentType, setDocumentType] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [isUploading, setIsUploading] = useState<boolean>(false);

	// Get global context for tenant and auth (same as SalaryComponentSetup)
	const { tenant, globalState } = useGlobal();

	const documentTypes = [
		{ value: 'contract', label: 'Employment Contract' },
		{ value: 'id_card', label: 'ID Card/Passport' },
		{ value: 'certificate', label: 'Certificate/Qualification' },
		{ value: 'resume', label: 'Resume/CV' },
		{ value: 'medical', label: 'Medical Certificate' },
		{ value: 'reference', label: 'Reference Letter' },
		{ value: 'bank_details', label: 'Bank Details' },
		{ value: 'tax_form', label: 'Tax Form' },
		{ value: 'other', label: 'Other' }
	];

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!selectedFile || !documentType) {
			alert('Please select a file and document type');
			return;
		}

		if (!employee?.employee_id) {
			alert('Employee ID is required for document upload');
			return;
		}

		setIsUploading(true);

		try {
			// Create FormData - backend expects the file path
			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append('document_type', documentType.toUpperCase()); // Backend might expect uppercase
			// Map the description to title for the backend
			formData.append('title', description || selectedFile.name);
			// Use description as notes as well, or leave empty
			formData.append('notes', description || 'Uploaded via Postman');
			
			// Use the same pattern as SalaryComponentSetup for API endpoint
			const baseURL = `${tenant}.exxforce.com`;
			const response = await axios.post(
				`https://${baseURL}/tenant/employee/${employee.employee_id}/documents`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${globalState.accessToken}`,
					},
					onUploadProgress: (progressEvent) => {
						const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
						console.log('Upload Progress:', percentCompleted, '%');
					},
				}
			);

			console.log('Upload successful:', response.data);

			// Reset form
			setSelectedFile(null);
			setDocumentType('');
			setDescription('');
			const fileInput = document.getElementById('document-upload') as HTMLInputElement;
			if (fileInput) {
				fileInput.value = '';
			}

			// Call the parent's onSubmit handler with the response data
			await onSubmit(response.data);
			
			onClose();
		} catch (error) {
			console.error('Error uploading document:', error);
			
			if (axios.isAxiosError(error)) {
				alert(`Upload failed: ${error.response?.data?.message || 'Unknown error occurred'}`);
			} else {
				alert('Failed to upload document');
			}
		} finally {
			setIsUploading(false);
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const getFileIcon = (fileName: string) => {
		const extension = fileName.split('.').pop()?.toLowerCase();
		switch (extension) {
			case 'pdf':
				return '📄';
			case 'doc':
			case 'docx':
				return '📝';
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
				return '🖼️';
			case 'xls':
			case 'xlsx':
				return '📊';
			default:
				return '📎';
		}
	};

	// Don't render anything if modal is not open
	if (!isOpen) return null;

	return (
		<div className="p-6 bg-white min-h-full">
			<div className="mb-6">
				<div className="flex items-center space-x-3 mb-2">
					<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
						<Upload className="w-5 h-5 text-blue-600" />
					</div>
					<div>
						<h2 className="text-xl font-semibold text-gray-900">{title}</h2>
						{employee && (
							<p className="text-sm text-gray-600">
								for {employee.first_name} {employee.last_name}
							</p>
						)}
					</div>
				</div>
				<p className="text-sm text-gray-600">
					Upload important documents such as contracts, certificates, or identification files
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="space-y-6">
					{/* Document Type Selection */}
					<div className="space-y-2">
						<Label htmlFor="document-type">Document Type <span className="text-red-500">*</span></Label>
						<select
							id="document-type"
							value={documentType}
							onChange={(e) => setDocumentType(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="">Select document type</option>
							{documentTypes.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>

					{/* File Upload */}
					<div className="space-y-2">
						<Label htmlFor="document-upload">Select File <span className="text-red-500">*</span></Label>
						<Input
							id="document-upload"
							type="file"
							accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xls,.xlsx"
							onChange={handleFileChange}
						/>
						<p className="text-xs text-gray-500">
							Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF, XLS, XLSX (Max: 10MB)
						</p>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Description (Optional)</Label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add a description or note about this document..."
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
							rows={3}
						/>
					</div>

					{/* Selected File Preview */}
					{selectedFile && (
						<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 text-2xl">
									{getFileIcon(selectedFile.name)}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-blue-900 truncate">
										{selectedFile.name}
									</p>
									<p className="text-xs text-blue-700">
										Size: {formatFileSize(selectedFile.size)}
									</p>
									{documentType && (
										<p className="text-xs text-blue-600 mt-1">
											Type: {documentTypes.find(t => t.value === documentType)?.label}
										</p>
									)}
								</div>
								<button
									type="button"
									onClick={() => {
										setSelectedFile(null);
										const fileInput = document.getElementById('document-upload') as HTMLInputElement;
										if (fileInput) {
											fileInput.value = '';
										}
									}}
									className="flex-shrink-0 p-1 hover:bg-blue-200 rounded-full transition-colors"
								>
									<X className="w-4 h-4 text-blue-600" />
								</button>
							</div>
						</div>
					)}

					{/* Upload Guidelines */}
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
							<FileText className="w-4 h-4 mr-2" />
							Upload Guidelines:
						</h4>
						<ul className="text-xs text-yellow-700 space-y-1">
							<li>• Ensure documents are clear and readable</li>
							<li>• Personal information should be visible if required</li>
							<li>• Maximum file size is 10MB</li>
							<li>• Use descriptive names for easy identification</li>
							<li>• Sensitive documents will be securely stored</li>
						</ul>
					</div>
				</div>

				<div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isUploading}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={!selectedFile || !documentType || isUploading || !employee?.employee_id}
						className="bg-blue-600 hover:bg-blue-700 text-white"
					>
						{isUploading ? (
							<>
								<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Uploading...
							</>
						) : (
							<>
								<Upload className="w-4 h-4 mr-2" />
								Upload Document
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default DocumentUploadModal;