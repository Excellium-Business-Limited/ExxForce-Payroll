'use client';

import React, { HtmlHTMLAttributes, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';

// Define props interface for the ImportModal component
interface ImportModalProps {
	title?: string;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (importData: any) => Promise<void>;
	children?: React.ReactNode;
}

const ImportModal: React.FC<ImportModalProps> = ({
	title = 'Import Employees',
	isOpen,
	onClose,
	onSubmit,
	children,
}) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState<boolean>(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedFile) {
			alert('Please select a file to import');
			return;
		}

		setIsUploading(true);

		try {
			// Create FormData for file upload
			const formData = new FormData();
			formData.append('file', selectedFile);

			// Call the parent's onSubmit handler
			await onSubmit(formData);

			// Reset form
			setSelectedFile(null);
			const fileInput = document.getElementById(
				'file-upload'
			) as HTMLInputElement;
			if (fileInput) {
				fileInput.value = '';
			}

			alert('Employees imported successfully!');
		} catch (error) {
			console.error('Error importing employees:', error);
			alert('Failed to import employees');
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className='p-6'>
			<div className='mb-6'>
				<h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
				<p className='text-sm text-gray-600 mt-1'>
					{`Upload a CSV or Excel file containing ${title} data`}
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='file-upload'>Select File</Label>
						<Input
							id='file-upload'
							type='file'
							accept='.csv,.xlsx,.xls'
							onChange={handleFileChange}
							required
						/>
						<p className='text-xs text-gray-500'>
							Supported formats: CSV, Excel (.xlsx, .xls)
						</p>
					</div>

					{selectedFile && (
						<div className='p-3 bg-blue-50 rounded-lg'>
							<p className='text-sm text-blue-800'>
								<strong>Selected file:</strong> {selectedFile.name}
							</p>
							<p className='text-xs text-blue-600'>
								Size: {(selectedFile.size / 1024).toFixed(2)} KB
							</p>
						</div>
					)}

					<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
						<h4 className='text-sm font-medium text-yellow-800 mb-2'>
							File Format Requirements:
						</h4>
						<ul className='text-xs text-yellow-700 space-y-1'>
							{/* <li>• Employee ID, First Name, Last Name (required)</li>
							<li>• Email, Phone Number, Job Title (required)</li>
							<li>• Department, Employment Type, Start Date (required)</li>
							<li>• Date of Birth, Gender, Address (optional)</li> */}
							{children}
						</ul>
					</div>
				</div>

				<div className='flex justify-end gap-3 mt-6'>
					<DialogClose asChild>
						<Button
							type='button'
							variant='outline'
							onClick={() => onClose}
							disabled={isUploading}>
							Cancel
						</Button>
					</DialogClose>
					<Button
						type='submit'
						disabled={!selectedFile || isUploading}
						className='bg-[#3D56A8] hover:bg-[#2E4299]'>
						{isUploading ? 'Importing...' : `Import ${title}`}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ImportModal;
