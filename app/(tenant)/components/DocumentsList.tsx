'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, User, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import axios from 'axios';
import { useGlobal } from '@/app/Context/context';

interface Document {
  id: number;
  title?: string;
  document_type?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  uploaded_at?: string;
  uploaded_by?: string;
  notes?: string;
}

interface DocumentsListProps {
  employee: {
    id?: number;
    employee_id: string;
    first_name: string;
    last_name: string;
    [key: string]: any;
  };
  onUploadDocument?: () => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ employee, onUploadDocument }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { tenant, globalState } = useGlobal();

  // Document type labels mapping
  const documentTypeLabels: Record<string, string> = {
    'CONTRACT': 'Employment Contract',
    'ID_CARD': 'ID Card/Passport',
    'CERTIFICATE': 'Certificate/Qualification',
    'RESUME': 'Resume/CV',
    'MEDICAL': 'Medical Certificate',
    'REFERENCE': 'Reference Letter',
    'BANK_DETAILS': 'Bank Details',
    'TAX_FORM': 'Tax Form',
    'OTHER': 'Other'
  };

  // Fetch employee documents
  const fetchDocuments = async () => {
    if (!employee?.employee_id) return;

    setIsLoading(true);
    setError('');

    try {
      const baseURL = `${tenant}.exxforce.com`;
      const response = await axios.get(
        `https://${baseURL}/tenant/employee/${employee.employee_id}/documents`,
        {
          headers: {
            Authorization: `Bearer ${globalState.accessToken}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Documents fetched:', response.data);

      // Handle different API response structures
      let documentsData: Document[] = [];
      if (Array.isArray(response.data)) {
        documentsData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        documentsData = response.data.data;
      } else if (response.data.documents && Array.isArray(response.data.documents)) {
        documentsData = response.data.documents;
      }

      setDocuments(documentsData);
    } catch (error) {
      console.error('Error fetching documents:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to load documents');
      } else {
        setError('Failed to load documents');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Download document with improved error handling and file naming
  const handleDownload = async (documentId: number, fileName?: string) => {
    setDownloadingId(documentId);

    try {
      const baseURL = `${tenant}.exxforce.com`;
      const response = await axios.get(
        `https://${baseURL}/tenant/employee/documents/${documentId}/download`,
        {
          headers: {
            Authorization: `Bearer ${globalState.accessToken}`,
            'Accept': 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/*, */*',
          },
          responseType: 'blob',
          timeout: 30000, // 30 second timeout
        }
      );

      console.log('Download response headers:', response.headers);
      console.log('Content-Type:', response.headers['content-type']);
      console.log('Content-Length:', response.headers['content-length']);

      // Extract filename from Content-Disposition header or use provided name
      let downloadFileName = fileName || `document_${documentId}`;
      const contentDisposition = response.headers['content-disposition'];
      
      if (contentDisposition) {
        // Handle both quoted and unquoted filenames, including UTF-8 encoded ones
        const matches = [
          contentDisposition.match(/filename\*=UTF-8''(.+)/i),
          contentDisposition.match(/filename="([^"]+)"/i),
          contentDisposition.match(/filename=([^;,\s]+)/i)
        ];
        
        for (const match of matches) {
          if (match?.[1]) {
            downloadFileName = decodeURIComponent(match[1].trim());
            break;
          }
        }
      }
      
      // Verify we actually got binary data
      if (!response.data || response.data.size === 0) {
        throw new Error('Received empty response');
      }

      // Resolve the correct filename and content type using headers, name and file signature
      const { fileName: finalName, contentType } = await resolveNameAndType(
        response.data,
        downloadFileName,
        response.headers['content-type']
      );

      console.log('Final download filename:', finalName);
      console.log('Final content type:', contentType);
      console.log('Blob size:', response.data.size);

      // Create blob with explicit content type
      const blob = new Blob([response.data], { type: contentType });
      
      // Verify blob was created successfully
      if (blob.size === 0) {
        throw new Error('Failed to create blob from response data');
      }
      
      // Create download URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
  link.download = finalName;
      link.style.display = 'none';
      
      // Add to DOM, click, then cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup URL after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

    } catch (error) {
      console.error('Download failed:', error);
      let errorMessage = 'Failed to download document';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Download timeout - file may be too large';
        } else if (error.response?.status === 404) {
          errorMessage = 'Document not found';
        } else if (error.response?.status === 403) {
          errorMessage = 'Access denied - insufficient permissions';
        } else {
          errorMessage = error.response?.data?.message || error.message || 'Download failed';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setDownloadingId(null);
    }
  };

  // Preview document with simplified logic
  const handlePreview = async (documentId: number, fileName?: string) => {
    try {
      const baseURL = `${tenant}.exxforce.com`;
      const response = await axios.get(
        `https://${baseURL}/tenant/employee/documents/${documentId}/download`,
        {
          headers: {
            Authorization: `Bearer ${globalState.accessToken}`,
            'Accept': 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/*, */*',
          },
          responseType: 'blob',
          timeout: 30000,
        }
      );

      console.log('Preview response headers:', response.headers);
      console.log('Preview Content-Type:', response.headers['content-type']);

      // Verify we got data
      if (!response.data || response.data.size === 0) {
        throw new Error('Received empty response');
      }

      // Resolve name/type to fix incorrect text/plain and ensure PDFs preview correctly
      const fallbackName = fileName || `document_${documentId}`;
      const { fileName: finalName, contentType } = await resolveNameAndType(
        response.data,
        fallbackName,
        response.headers['content-type']
      );

      // Create blob with proper content type
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      
      console.log('Preview blob created:', { size: blob.size, type: blob.type });
      
      // Open in new tab for preview - works well for PDFs and images
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        // Fallback if popup blocked - download instead
        console.warn('Popup blocked, falling back to download');
        const link = document.createElement('a');
        link.href = url;
        link.download = finalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // Cleanup URL after delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 10000);

    } catch (error) {
      console.error('Preview failed:', error);
      let errorMessage = 'Failed to preview document';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Preview timeout - file may be too large';
        } else if (error.response?.status === 404) {
          errorMessage = 'Document not found';
        } else if (error.response?.status === 403) {
          errorMessage = 'Access denied - insufficient permissions';
        } else {
          errorMessage = error.response?.data?.message || error.message || 'Preview failed';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get file extension from filename
  const getFileExtension = (fileName: string): string => {
    if (!fileName) return '';
    const lastDot = fileName.lastIndexOf('.');
    return lastDot !== -1 ? fileName.substring(lastDot) : '';
  };

  // Get MIME type from file extension
  const getMimeTypeFromExtension = (fileName: string): string => {
    const extension = getFileExtension(fileName).toLowerCase();
    const extensionToMime: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.svg': 'image/svg+xml',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.7z': 'application/x-7z-compressed',
    };
    
    return extensionToMime[extension] || 'application/octet-stream';
  };

  // Get file extension from content type (fallback)
  const getFileExtensionFromContentType = (contentType: string): string => {
    // Clean content type and convert to lowercase
    const cleanContentType = contentType.split(';')[0].trim().toLowerCase();
    
    const mimeToExtension: Record<string, string> = {
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.ms-excel': '.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.ms-powerpoint': '.ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/bmp': '.bmp',
      'image/svg+xml': '.svg',
      'image/webp': '.webp',
      'text/plain': '.txt',
      'text/csv': '.csv',
      'text/html': '.html',
      'application/zip': '.zip',
      'application/x-zip-compressed': '.zip',
      'application/vnd.rar': '.rar',
      'application/x-rar-compressed': '.rar',
      'application/x-7z-compressed': '.7z',
      'application/json': '.json',
      'application/xml': '.xml',
      'text/xml': '.xml',
    };
    
    return mimeToExtension[cleanContentType] || '';
  };

  // Detect common file types from the first few bytes of a blob (magic numbers)
  const detectMimeFromBlob = async (blob: Blob): Promise<{ mime?: string; ext?: string }> => {
    try {
      const maxHeader = 16;
      const buf = await blob.slice(0, maxHeader).arrayBuffer();
      const bytes = new Uint8Array(buf);
      const startsWith = (sig: number[]) => sig.every((b, i) => bytes[i] === b);

      // PDF: 25 50 44 46 2D => %PDF-
      if (startsWith([0x25, 0x50, 0x44, 0x46, 0x2D])) {
        return { mime: 'application/pdf', ext: '.pdf' };
      }
      // PNG
      if (startsWith([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
        return { mime: 'image/png', ext: '.png' };
      }
      // JPG
      if (startsWith([0xFF, 0xD8, 0xFF])) {
        return { mime: 'image/jpeg', ext: '.jpg' };
      }
      // GIF
      if (startsWith([0x47, 0x49, 0x46, 0x38])) {
        return { mime: 'image/gif', ext: '.gif' };
      }
      // BMP
      if (startsWith([0x42, 0x4D])) {
        return { mime: 'image/bmp', ext: '.bmp' };
      }
      // ZIP/OOXML (docx/xlsx/pptx) - cannot easily distinguish without deeper inspection
      if (startsWith([0x50, 0x4B, 0x03, 0x04])) {
        return { mime: 'application/zip', ext: '.zip' };
      }
      // RAR4 / RAR5
      if (startsWith([0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00]) || startsWith([0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x01, 0x00])) {
        return { mime: 'application/x-rar-compressed', ext: '.rar' };
      }
      // 7z
      if (startsWith([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) {
        return { mime: 'application/x-7z-compressed', ext: '.7z' };
      }
      // Legacy MS Office Compound File Binary
      if (startsWith([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])) {
        return { mime: 'application/msword', ext: '.doc' };
      }
    } catch (e) {
      // ignore and fall back
      console.warn('File signature detection failed', e);
    }
    return {};
  };

  // Ensure we have a sensible content type and filename extension
  const resolveNameAndType = async (
    rawBlob: Blob,
    proposedName: string,
    headerContentType?: string
  ): Promise<{ fileName: string; contentType: string }> => {
    let fileName = proposedName || 'document';
    let contentType = (headerContentType || 'application/octet-stream').split(';')[0].trim().toLowerCase();

    // If filename has an extension, prefer its MIME over an obviously wrong text/plain
    const nameExt = getFileExtension(fileName);
    if (nameExt) {
      const mimeFromName = getMimeTypeFromExtension(fileName);
      if (mimeFromName && (contentType === 'text/plain' || contentType === 'application/octet-stream')) {
        contentType = mimeFromName;
      }
    }

    // If no extension or it's .txt but content is binary, sniff the blob
    if (!nameExt || nameExt.toLowerCase() === '.txt') {
      const sniff = await detectMimeFromBlob(rawBlob);
      if (sniff.mime) {
        // Override incorrect content type
        contentType = sniff.mime;
        // Only append/replace extension if missing or .txt
        if (!nameExt || nameExt.toLowerCase() === '.txt') {
          if (!fileName.toLowerCase().endsWith(sniff.ext || '')) {
            fileName = fileName.replace(/\.+[^.]*$/, ''); // strip existing ext if any
            if (sniff.ext) fileName += sniff.ext;
          }
        }
      }
    }

    // If still no extension, try mapping the (possibly corrected) content type
    if (!getFileExtension(fileName)) {
      const extFromType = getFileExtensionFromContentType(contentType);
      if (extFromType) fileName += extFromType;
    }

    return { fileName, contentType };
  };

  // Get file icon based on file extension
  const getFileIcon = (fileName: string | undefined): string => {
    if (!fileName || typeof fileName !== 'string') {
      return '📎'; // Default icon for invalid filenames
    }
    
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

  // Get document type badge color with professional styling
  const getDocumentTypeBadge = (type: string | undefined) => {
    if (!type) return 'bg-gray-100 text-gray-700 border-gray-300';
    
    const colors: Record<string, string> = {
      'CONTRACT': 'bg-emerald-50 text-emerald-700 border-emerald-300',
      'ID_CARD': 'bg-blue-50 text-blue-700 border-blue-300',
      'CERTIFICATE': 'bg-violet-50 text-violet-700 border-violet-300',
      'RESUME': 'bg-amber-50 text-amber-700 border-amber-300',
      'MEDICAL': 'bg-rose-50 text-rose-700 border-rose-300',
      'REFERENCE': 'bg-indigo-50 text-indigo-700 border-indigo-300',
      'BANK_DETAILS': 'bg-orange-50 text-orange-700 border-orange-300',
      'TAX_FORM': 'bg-pink-50 text-pink-700 border-pink-300',
      'OTHER': 'bg-slate-50 text-slate-700 border-slate-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, [employee?.employee_id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="animate-spin h-5 w-5 text-blue-600" />
          <span className="text-gray-600">Loading documents...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Documents</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchDocuments}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="mb-8">
          <div className="relative">
            <div className="bg-white rounded-lg shadow-lg p-6 w-56 h-36 border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xs text-gray-400">Documents</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-50 rounded border flex items-center justify-center">
                    <FileText className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="h-2 bg-blue-100 rounded flex-1"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-50 rounded border flex items-center justify-center">
                    <FileText className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="h-2 bg-blue-100 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">No documents uploaded</h3>
        <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
          No documents found for {employee.first_name} {employee.last_name}. 
          Upload important documents such as contracts, ID copies, or certificates.
        </p>

        {onUploadDocument && (
          <button
            onClick={onUploadDocument}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Upload Document
          </button>
        )}
      </div>
    );
  }

  // Documents list
  return (
    <div className="space-y-6">
      {/* Header - Professional Business Style */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm mb-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Employee Document Registry
                </h3>
                <p className="text-sm text-gray-600">
                  {employee.first_name} {employee.last_name} • ID: {employee.employee_id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-300 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {documents.length} Document{documents.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>All documents are encrypted and securely stored</span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={fetchDocuments}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              {onUploadDocument && (
                <button
                  onClick={onUploadDocument}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Document
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid - Official Business Style */}
      <div className="space-y-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            {/* Document Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-blue-200">
                    <span className="text-2xl">{getFileIcon(document.file_name)}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {document.title || 'Untitled Document'}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="bg-white px-2 py-1 rounded-md border border-gray-200 font-mono text-xs">
                        {document.file_name || 'Unknown filename'}
                      </span>
                      {document.file_size && (
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                          {formatFileSize(document.file_size)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${getDocumentTypeBadge(
                    document.document_type
                  )} shadow-sm`}
                >
                  {document.document_type ? (documentTypeLabels[document.document_type] || document.document_type) : 'Unknown Type'}
                </span>
              </div>
            </div>

            {/* Document Body */}
            <div className="px-6 py-4">
              {/* Document Meta Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Document Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-gray-500">Upload Date:</span>
                      <p className="font-medium text-gray-900">{formatDate(document.uploaded_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="text-gray-500">Document ID:</span>
                      <p className="font-medium text-gray-900 font-mono">#{document.id.toString().padStart(6, '0')}</p>
                    </div>
                  </div>
                  {document.uploaded_by && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-gray-500">Uploaded by:</span>
                        <p className="font-medium text-gray-900">{document.uploaded_by}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              {document.notes && (
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Notes
                  </h5>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700 italic">"{document.notes}"</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Confidential Document</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePreview(document.id, document.file_name)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(document.id, document.file_name)}
                    disabled={downloadingId === document.id}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {downloadingId === document.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsList;