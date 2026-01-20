import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems
}) => {
  if (totalPages <= 1) return null;

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Calculate start and end pages
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      items.push(
        <BootstrapPagination.Item key={1} onClick={() => onPageChange(1)}>
          1
        </BootstrapPagination.Item>
      );
      if (startPage > 2) {
        items.push(<BootstrapPagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <BootstrapPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </BootstrapPagination.Item>
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<BootstrapPagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <BootstrapPagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </BootstrapPagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      {showInfo && totalItems !== undefined && (
        <div className="text-muted">
          Showing page {currentPage} of {totalPages} ({totalItems} total items)
        </div>
      )}
      
      <BootstrapPagination className="mb-0">
        <BootstrapPagination.First
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        />
        <BootstrapPagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        />
        
        {renderPaginationItems()}
        
        <BootstrapPagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
        <BootstrapPagination.Last
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        />
      </BootstrapPagination>
    </div>
  );
};

export default Pagination;