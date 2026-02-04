import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationModel = {
  currentPage: number; // 0-based
  totalPages: number;
};

interface PaginationProps {
  pagination: PaginationModel;
  onChangePage: (page: number) => void;
}

function getWindowPages(current: number, total: number, windowSize: number) {
  const size = Math.max(1, Math.min(windowSize, total));
  let start = current - Math.floor(size / 2);
  let end = start + size - 1;

  if (start < 0) {
    start = 0;
    end = size - 1;
  }

  if (end > total - 1) {
    end = total - 1;
    start = Math.max(0, end - (size - 1));
  }

  return { start, end, size };
}

export const Pagination: React.FC<PaginationProps> = ({ pagination, onChangePage }) => {
  const { currentPage, totalPages } = pagination;
  const WINDOW = 5;

  if (totalPages <= 1) return null;

  const { start, end } = getWindowPages(currentPage, totalPages, WINDOW);

  const shell = "w-12 h-12 flex items-center justify-center rounded-2xl border  transition-all"
  + " disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer";
  const shellTheme =
    "border-[color:var(--nav-border)] bg-[color:var(--nav-bg)] text-[color:var(--nav-muted)] " +
    "hover:text-emerald-600 hover:border-emerald-200 " +
    "disabled:hover:text-[color:var(--nav-muted)]";

  const PageButton: React.FC<{ page: number }> = ({ page }) => {
    const active = page === currentPage;
    return (
      <button
        key={page}
        onClick={() => onChangePage(page)}
        aria-current={active ? "page" : undefined}
        className={[
          "w-11 h-11 rounded-full text-xs font-black transition-all cursor-pointer",
          active
            ? "bg-emerald-600 text-white scale-110"
            : "text-[color:var(--nav-muted)] hover:text-[color:var(--nav-text)] hover:bg-[color:var(--modal-ghost-hover-bg)]",
        ].join(" ")}
      >
        {page + 1}
      </button>
    );
  };

  const Ellipsis = () => (
    <span className="w-11 h-11 inline-flex items-center justify-center text-[color:var(--nav-muted-2)]">
      <MoreHorizontal size={18} />
    </span>
  );

  const showLeftEllipsis = start > 0;
  const showRightEllipsis = end < totalPages - 1;

  const firstPage = 0;
  const lastPage = totalPages - 1;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pb-10">
      <button
        disabled={currentPage === 0}
        onClick={() => onChangePage(currentPage - 1)}
        className={`${shell} ${shellTheme}`}
        aria-label="Página anterior"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1 p-1.5 rounded-[2rem] border
        bg-[color:var(--nav-bg)] border-[color:var(--nav-border)]">
        {showLeftEllipsis && (
          <>
            <PageButton page={firstPage} />
            {start > firstPage + 1 ? <Ellipsis /> : null}
          </>
        )}

        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
          <PageButton key={p} page={p} />
        ))}

        {showRightEllipsis && (
          <>
            {end < lastPage - 1 ? <Ellipsis /> : null}
            <PageButton page={lastPage} />
          </>
        )}
      </div>

      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => onChangePage(currentPage + 1)}
        className={`${shell} ${shellTheme}`}
        aria-label="Próxima página"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
