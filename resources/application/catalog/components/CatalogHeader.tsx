import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Leaf, Menu, ClipboardList, ShoppingCart, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { Catalog, CategoryGroup } from '../types/catalog';
import { formatBadgeCount, formatPersianNumber } from '../utils/currency';
import { CategoryNavList } from './CategoryNavList';
import { SearchBar } from './SearchBar';

type CatalogHeaderProps = {
    catalog: Catalog;
    totalProducts: number;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    resultCount: number;
    cartCount?: number;
    cartTo?: string;
    ordersCount?: number;
    ordersTo?: string;
    /** Optional company/brand logo URL. */
    logoUrl?: string;
    categoryGroups?: CategoryGroup[];
    activeCategoryId?: string | null;
    onSelectCategory?: (categoryId: string) => void;
};

/**
 * Sticky catalog header — minimal single-bar layout with search and cart.
 * On mobile, categories open in a full-height panel sliding in from the right.
 */
export function CatalogHeader({
    catalog,
    totalProducts,
    searchQuery,
    onSearchChange,
    resultCount,
    cartCount = 0,
    cartTo,
    ordersCount = 0,
    ordersTo,
    logoUrl = '/images/logo.png',
    categoryGroups = [],
    activeCategoryId = null,
    onSelectCategory,
}: CatalogHeaderProps) {
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
    const hasCategories = categoryGroups.length > 0 && !!onSelectCategory;

    const subtitle =
        catalog.description ??
        `${formatPersianNumber(totalProducts)} محصول در کاتالوگ`;

    useEffect(() => {
        if (!categoryMenuOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setCategoryMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [categoryMenuOpen]);

    return (
        <header
            className={clsx(
                'sticky top-0 z-30 border-b border-brand-100/70 bg-white/90 backdrop-blur-xl',
                'supports-[backdrop-filter]:bg-white/75',
            )}
        >
            <div className="mx-auto max-w-screen-2xl px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    {hasCategories && (
                        <button
                            type="button"
                            onClick={() => setCategoryMenuOpen(true)}
                            className={clsx(
                                'inline-flex size-10 shrink-0 items-center justify-center rounded-xl lg:hidden',
                                'border border-brand-100 bg-white text-brand-700 shadow-sm',
                                'transition hover:border-brand-200 hover:bg-brand-50',
                                'focus:outline-none focus:ring-2 focus:ring-brand-500/30',
                            )}
                            aria-expanded={categoryMenuOpen}
                            aria-controls="catalog-mobile-categories"
                            aria-label="نمایش دسته‌بندی‌ها"
                        >
                            <Menu className="size-[18px]" strokeWidth={2} />
                        </button>
                    )}

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
                    <div className="flex shrink-0 items-center gap-2">
                        {ordersTo && (
                            <Link
                                to={ordersTo}
                                className={clsx(
                                    'relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl',
                                    'border border-brand-100 bg-white text-brand-700 shadow-sm',
                                    'transition hover:border-brand-200 hover:bg-brand-50',
                                    'focus:outline-none focus:ring-2 focus:ring-brand-500/30',
                                )}
                                aria-label={
                                    ordersCount > 0
                                        ? `سفارش‌های من، ${formatPersianNumber(ordersCount)} سفارش`
                                        : 'سفارش‌های من'
                                }
                            >
                                <ClipboardList className="size-[18px]" strokeWidth={2} />
                                {ordersCount > 0 && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute -top-1.5 -start-1.5 grid size-5 place-items-center rounded-full bg-brand-700 text-[10px] font-bold leading-none text-white ring-2 ring-white"
                                    >
                                        {formatBadgeCount(ordersCount)}
                                    </span>
                                )}
                            </Link>
                        )}

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

            {hasCategories &&
                typeof document !== 'undefined' &&
                createPortal(
                    <AnimatePresence>
                        {categoryMenuOpen && (
                            <motion.aside
                                id="catalog-mobile-categories"
                                role="dialog"
                                aria-modal="true"
                                aria-label="دسته‌بندی محصولات"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                                className="fixed inset-y-0 start-0 z-[100] flex h-dvh w-full flex-col bg-white lg:hidden"
                            >
                                <div className="flex items-center justify-between border-b border-brand-100 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
                                        <Leaf aria-hidden="true" className="size-3.5" />
                                        دسته‌بندی‌ها
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCategoryMenuOpen(false)}
                                        className={clsx(
                                            'inline-flex size-9 items-center justify-center rounded-xl',
                                            'text-slate-500 transition hover:bg-brand-50 hover:text-brand-700',
                                            'focus:outline-none focus:ring-2 focus:ring-brand-500/30',
                                        )}
                                        aria-label="بستن دسته‌بندی‌ها"
                                    >
                                        <X className="size-[18px]" strokeWidth={2} />
                                    </button>
                                </div>
                                <nav className="min-h-0 flex-1 overflow-y-auto p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                                    <CategoryNavList
                                        groups={categoryGroups}
                                        activeCategoryId={activeCategoryId}
                                        onSelectCategory={onSelectCategory!}
                                        onItemSelect={() => setCategoryMenuOpen(false)}
                                    />
                                </nav>
                            </motion.aside>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </header>
    );
}
