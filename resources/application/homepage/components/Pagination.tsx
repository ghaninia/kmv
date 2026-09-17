import { formatPersianNumber } from '../utils/format';

type PaginationProps = {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    /** سقف صفحات قابل نمایش (مثلاً فقط ۱ و ۲) */
    maxPage?: number;
    className?: string;
};

export function Pagination({ currentPage, lastPage, onPageChange, maxPage, className }: PaginationProps) {
    const effectiveLastPage = maxPage ? Math.min(lastPage, maxPage) : lastPage;
    const effectiveCurrentPage = Math.min(currentPage, effectiveLastPage);

    if (effectiveLastPage <= 1) {
        return null;
    }

    const pages = Array.from({ length: effectiveLastPage }, (_, index) => index + 1)
        .filter(
            (page) =>
                page === 1 ||
                page === effectiveLastPage ||
                Math.abs(page - effectiveCurrentPage) <= 1,
        );

    return (
        <nav className={['cm-pagination', className].filter(Boolean).join(' ')} aria-label="صفحه‌بندی">
            <button
                type="button"
                disabled={effectiveCurrentPage <= 1}
                onClick={() => onPageChange(effectiveCurrentPage - 1)}
            >
                قبلی
            </button>
            <div className="cm-pagination-pages">
                {pages.map((page, index) => {
                    const prev = pages[index - 1];
                    const showEllipsis = prev && page - prev > 1;

                    return (
                        <span key={page} className="cm-pagination-group">
                            {showEllipsis && <span className="cm-pagination-ellipsis">…</span>}
                            <button
                                type="button"
                                className={page === effectiveCurrentPage ? 'is-active' : undefined}
                                onClick={() => onPageChange(page)}
                            >
                                {formatPersianNumber(page)}
                            </button>
                        </span>
                    );
                })}
            </div>
            <button
                type="button"
                disabled={effectiveCurrentPage >= effectiveLastPage}
                onClick={() => onPageChange(effectiveCurrentPage + 1)}
            >
                بعدی
            </button>
        </nav>
    );
}
