'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  onItemsPerPageChange?: (items: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  const pageNumbers = []
  const maxPagesToShow = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex items-center justify-between gap-4 mt-6 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Items per page:</span>
        {onItemsPerPageChange && (
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
        >
          <ChevronLeft size={20} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 rounded hover:bg-gray-200 transition text-sm"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-600">...</span>}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded text-sm transition ${
              pageNum === currentPage
                ? 'bg-[#B76E79] text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-600">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 rounded hover:bg-gray-200 transition text-sm"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

export default Pagination
