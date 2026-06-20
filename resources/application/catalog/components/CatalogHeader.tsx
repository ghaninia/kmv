import { Sprout, Wheat } from 'lucide-react';
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
                'sticky top-0 z-30 border-b border-brand-100 bg-white/85 backdrop-blur-md',
                'supports-[backdrop-filter]:bg-white/70',
            )}
        >
            {/* Thin harvest gradient accent line. */}
            <div
                aria-hidden="true"
                className="h-1 w-full bg-gradient-to-l from-brand-500 via-lime-400 to-amber-400"
            />
            <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-5">
                {/* Brand / title block. */}
                <div className="flex items-center gap-4">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt=""
                            className="size-12 shrink-0 rounded-2xl object-contain ring-1 ring-brand-200"
                        />
                    ) : (
                        <span
                            aria-hidden="true"
                            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25 ring-1 ring-brand-700/20"
                        >
                            <Sprout className="size-6" />
                        </span>
                    )}
                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-bold tracking-tight text-brand-950 sm:text-2xl">
                            {catalog.title}
                        </h1>
                        {catalog.description ? (
                            <p className="mt-0.5 line-clamp-1 max-w-xl text-sm text-slate-500">
                                {catalog.description}
                            </p>
                        ) : (
                            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-brand-600">
                                <Wheat aria-hidden="true" className="size-4" />
                                کاتالوگ محصولات و نهاده‌های کشاورزی
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
                        className="hidden shrink-0 items-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm font-medium text-brand-700 ring-1 ring-brand-200 sm:flex"
                        aria-label={`${totalProducts} محصول در کاتالوگ`}
                    >
                        <Wheat aria-hidden="true" className="size-4 text-brand-500" />
                        <span className="tabular-nums text-brand-900">
                            {formatPersianNumber(totalProducts)}
                        </span>
                        <span className="text-brand-500">محصول</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
