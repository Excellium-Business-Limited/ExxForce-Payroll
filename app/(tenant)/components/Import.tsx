'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

// Define props interface for the ImportModal component
interface ImportModalProps {
  title?: string;
  isOpen: boolean; // kept for backward compatibility when used in Dialog
  onClose: () => void;
  onSubmit: (importData: any) => Promise<void>;
  children?: React.ReactNode;
  inlineMode?: boolean; // when true, render as inline card/page (no DialogClose wrapper)
}

const ImportModal: React.FC<ImportModalProps> = ({
  title = 'Import Employees',
  isOpen,
  onClose,
  onSubmit,
  children,
  inlineMode = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const inputId = useMemo(() => {
    const slug = String(title || 'import')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `file-upload-${slug}`;
  }, [title]);

  // Derive template file based on title
  const templateFile = useMemo(() => {
    const t = title.toLowerCase();
    if (t.includes('employee')) return 'employee_import_template.csv';
    if (t.includes('loan')) return 'loans.csv';
    return '';
  }, [title]);

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
      // Client-side file size guard (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setParseError('File too large. Maximum allowed size is 5MB.');
        return;
      }

      // Prepare FormData as the backend expects multipart/form-data
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Forward raw FormData to parent handler which will POST to the backend
      await onSubmit(formData);

      // Reset form
      setSelectedFile(null);
      const fileInput = document.getElementById(inputId) as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error importing:', error);
      alert('Failed to import.');
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
            <Label htmlFor={inputId}>Select File</Label>
            <div className='flex items-center gap-3'>
              <Input
                id={inputId}
                type='file'
                accept='.csv,.xlsx,.xls'
                onChange={handleFileChange}
              />

              {/* Download sample template link */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={templateFile ? `/templates/${templateFile}` : '#'}
                    download={templateFile}
                    className={`text-sm text-blue-600 underline ml-2 ${!templateFile ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    Download Sample Template
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <div>Download template for sample data</div>
                </TooltipContent>
              </Tooltip>
            </div>
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

          {parseError && (
            <div className='mt-3 text-sm text-red-600 bg-red-50 p-2 rounded'>
              {parseError}
            </div>
          )}

          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <h4 className='text-sm font-medium text-yellow-800 mb-2'>
              File Format Requirements:
            </h4>
            <ul className='text-xs text-yellow-700 space-y-1'>
              {children}
            </ul>
          </div>
        </div>

        <div className='flex justify-end gap-3 mt-6'>
          {inlineMode ? (
            <Button
              type='button'
              variant='outline'
              disabled={isUploading}
              onClick={() => {
                setSelectedFile(null);
                const fileInput = document.getElementById(inputId) as HTMLInputElement | null;
                if (fileInput) fileInput.value = '';
                onClose?.();
              }}
            >
              Cancel
            </Button>
          ) : (
            <DialogClose asChild>
              <Button
                type='button'
                variant='outline'
                disabled={isUploading}
              >
                Cancel
              </Button>
            </DialogClose>
          )}
          <Button
            type='submit'
            disabled={!selectedFile || isUploading}
            className='bg-[#3D56A8] hover:bg-[#2E4299]'
          >
            {isUploading ? 'Importing...' : `Import ${title}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ImportModal;
