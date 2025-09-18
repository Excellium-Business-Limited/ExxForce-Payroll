'use client'

import React from 'react'
import clsx from 'clsx'

export interface PageSizeSelectorProps {
  pageSize: number
  options?: number[]
  onChange: (newSize: number) => void
  className?: string
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  pageSize,
  options = [5, 10, 25, 50, 100],
  onChange,
  className,
}) => {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <span className='text-sm text-gray-600'>Show</span>
      <select
        value={pageSize}
        onChange={(e) => onChange(Number(e.target.value))}
        className='border border-gray-300 rounded px-2 py-1 text-sm bg-white'
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className='text-sm text-gray-600'>entries per page</span>
    </div>
  )
}

export interface PaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  className?: string
  showSummary?: boolean
  showGoTo?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  className,
  showSummary = true,
  showGoTo = true,
}) => {
  const totalPages = Math.max(0, Math.ceil(totalItems / pageSize))

  const handlePreviousPage = (): void => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNextPage = (): void => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)

      if (currentPage < totalPages - 2) pages.push('...')
      if (totalPages > 1) pages.push(totalPages)
    }

    return pages
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div
      className={clsx(
        'flex flex-col sm:flex-row items-center justify-between gap-4',
        className
      )}
    >
      {showSummary && (
        <div className='text-sm text-gray-600'>
          Showing {startItem} to {endItem} of {totalItems} entries
        </div>
      )}

      <div className='flex items-center gap-2'>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || totalPages === 0}
          className={clsx(
            'p-2 rounded border transition-colors',
            currentPage === 1 || totalPages === 0
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          )}
          aria-label='Previous page'
        >
          <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
            <path
              d='M15 18L9 12L15 6'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <div className='flex items-center gap-1'>
          {getPageNumbers().map((page, idx) => (
            <React.Fragment key={`${page}-${idx}`}>
              {page === '...' ? (
                <span className='px-3 py-1 text-gray-500 text-sm'>...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={clsx(
                    'px-3 py-1 text-sm rounded transition-colors',
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className={clsx(
            'p-2 rounded border transition-colors',
            currentPage === totalPages || totalPages === 0
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          )}
          aria-label='Next page'
        >
          <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none'>
            <path
              d='M9 18L15 12L9 6'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>

      {showGoTo && (
        <div className='flex items-center gap-2 text-sm'>
          <span className='text-gray-600'>Go to page:</span>
          <input
            type='number'
            min={1}
            max={Math.max(1, totalPages)}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value)
              if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
                onPageChange(page)
              }
            }}
            className='w-16 px-2 py-1 border border-gray-300 rounded text-center'
          />
          <span className='text-gray-600'>of {totalPages}</span>
        </div>
      )}
    </div>
  )
}

export default Pagination
