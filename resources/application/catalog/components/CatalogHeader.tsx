import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { clsx } from 'clsx';
import type { Catalog } from '../types/catalog';
import { formatBadgeCount, formatPersianNumber } from '../utils/currency';
import { SearchBar } from './SearchBar';

type CatalogHeaderProps = {
    catalog: Catalog;
    totalProducts: number;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    resultCount: number;
    cartCount?: number;
    cartTo?: string;
    /** Optional company/brand logo URL. */
    logoUrl?: string;
};

/**
 * Sticky catalog header — minimal single-bar layout with search and cart.
 */
export function CatalogHeader({
    catalog,
    totalProducts,
    searchQuery,
    onSearchChange,
    resultCount,
    cartCount = 0,
    cartTo,
    logoUrl = '/images/logo.png',
}: CatalogHeaderProps) {
    const subtitle =
        catalog.description ??
        `${formatPersianNumber(totalProducts)} محصول در کاتالوگ`;

    return (
        <header
            className={clsx(
                'sticky top-0 z-30 border-b border-brand-100/70 bg-white/90 backdrop-blur-xl',
                'supports-[backdrop-filter]:bg-white/75',
            )}
        >
            <div className="mx-auto max-w-screen-2xl px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Brand */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt=""
                                className="hidden h-9 w-auto shrink-0 object-contain sm:block"
                            />
                        ) : null}
                        <div className="min-w-0">
                            <h1 className="truncate text-base font-bold tracking-tight text-brand-950 sm:text-lg">
                                {catalog.title}
                            </h1>
                            <p className="truncate text-xs text-slate-400">{subtitle}</p>
                        </div>
                    </div>

                    {/* Desktop search */}
                    <SearchBar
                        value={searchQuery}
                        onChange={onSearchChange}
                        resultCount={resultCount}
                        className="hidden w-56 lg:block lg:w-72"
                    />

                    {/* Cart */}
                    {cartTo && (
                        <Link
                            to={cartTo}
                            className={clsx(
                                'relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl',
                                'border border-brand-100 bg-white text-brand-700 shadow-sm',
                                'transition hover:border-brand-200 hover:bg-brand-50',
                                'focus:outline-none focus:ring-2 focus:ring-brand-500/30',
                            )}
                            aria-label={
                                cartCount > 0
                                    ? `سبد خرید، ${formatPersianNumber(cartCount)} قلم`
                                    : 'سبد خرید'
                            }
                        >
                            <ShoppingCart className="size-[18px]" strokeWidth={2} />
                            {cartCount > 0 && (
                                <span
                                    aria-hidden="true"
                                    className="absolute -top-1.5 -start-1.5 grid size-5 place-items-center rounded-full bg-brand-700 text-[10px] font-bold leading-none text-white ring-2 ring-white"
                                >
                                    {formatBadgeCount(cartCount)}
                                </span>
                            )}
                        </Link>
                    )}
                </div>

                {/* Mobile / tablet search */}
                <div className="mt-3 lg:hidden">
                    <SearchBar
                        value={searchQuery}
                        onChange={onSearchChange}
                        resultCount={resultCount}
                        className="w-full"
                    />
                </div>
            </div>
        </header>
    );
}
