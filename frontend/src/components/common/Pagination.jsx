import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) return null;

  return (
    <div className="pagination">
      <span>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <div>
        <button
          className="icon-button"
          disabled={!pagination.hasPrevPage}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="icon-button"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
