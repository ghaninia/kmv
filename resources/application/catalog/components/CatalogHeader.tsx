import { Boxes, Package } from 'lucide-react';
import { clsx } from 'clsx';
import type { Catalog } from '../types/catalog';
import { formatPersianNumber } from '../utils/currency';
import { SearchBar } from './SearchBar';

type CatalogHeaderProps = {
    catalog: Catalog;
    totalProducts: number;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    resultCount: number;
    /** Optional company/brand logo URL. */
    logoUrl?: string;
};

/**
 * Sticky catalog header.
 *
 * Shows the catalog title and description (with an optional company logo), a
 * total product count, and the global search field. Stays pinned to the top of
 * the viewport while the content scrolls beneath it.
 */
export function CatalogHeader({
    catalog,
    totalProducts,
    searchQuery,
    onSearchChange,
    resultCount,
    logoUrl,
}: CatalogHeaderProps) {
    return (
        <header
            className={clsx(
                'sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md',
                'supports-[backdrop-filter]:bg-white/70',
            )}
        >
            <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-5">
                {/* Brand / title block. */}
                <div className="flex items-center gap-4">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt=""
                            className="size-12 shrink-0 rounded-xl object-contain ring-1 ring-slate-200"
                        />
                    ) : (
                        <span
                            aria-hidden="true"
                            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm"
                        >
                            <Boxes className="size-6" />
                        </span>
                    )}
                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            {catalog.title}
                        </h1>
                        {catalog.description && (
                            <p className="mt-0.5 line-clamp-1 max-w-xl text-sm text-slate-500">
                                {catalog.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Search + count. */}
                <div className="flex items-center gap-3 lg:gap-4">
                    <SearchBar
                        value={searchQuery}
                        onChange={onSearchChange}
                        resultCount={resultCount}
                        className="w-full lg:w-80"
                    />
                    <div
                        className="hidden shrink-0 items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 sm:flex"
                        aria-label={`${totalProducts} products in catalog`}
                    >
                        <Package aria-hidden="true" className="size-4 text-slate-400" />
                        <span className="tabular-nums text-slate-900">
                            {formatPersianNumber(totalProducts)}
                        </span>
                        <span className="text-slate-400">products</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
