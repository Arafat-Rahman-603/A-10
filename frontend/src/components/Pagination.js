'use client';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ 
          background: 'var(--bg-tertiary)', 
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)'
        }}
      >
        Prev
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
            page === currentPage
              ? 'bg-gradient-primary text-white shadow-lg'
              : ''
          }`}
          style={page !== currentPage ? { 
            background: 'var(--bg-tertiary)', 
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)'
          } : {}}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ 
          background: 'var(--bg-tertiary)', 
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)'
        }}
      >
        Next
      </button>
    </div>
  );
}
