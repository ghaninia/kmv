import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { clsx } from 'clsx';
import type { CategoryGroup } from '../types/catalog';
import { formatPersianNumber } from '../utils/currency';

type CatalogSidebarProps = {
    groups: CategoryGroup[];
    activeCategoryId: string | null;
    onSelectCategory: (categoryId: string) => void;
};

/**
 * Category navigation sidebar.
 *
 * Lists every category with its product count, highlights the section the user
 * is currently viewing, and smoothly scrolls to a section when clicked. Sticky
 * on desktop; rendered as a horizontal scroller on mobile via the parent
 * layout. Implemented as a labelled `nav` with a single-select list for
 * screen-reader clarity and full keyboard support.
 */
export function CatalogSidebar({
    groups,
    activeCategoryId,
    onSelectCategory,
}: CatalogSidebarProps) {
    const totalProducts = groups.reduce((sum, group) => sum + group.products.length, 0);

    return (
        <nav aria-label="Product categories" className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <LayoutGrid aria-hidden="true" className="size-3.5" />
                    Categories
                </div>

                <ul className="mt-1 space-y-1">
                    {groups.map((group) => {
                        const isActive = group.category.id === activeCategoryId;
                        return (
                            <li key={group.category.id}>
                                <button
                                    type="button"
                                    onClick={() => onSelectCategory(group.category.id)}
                                    aria-current={isActive ? 'true' : undefined}
                                    className={clsx(
                                        'group relative flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50',
                                        isActive
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="active-category-indicator"
                                            aria-hidden="true"
                                            className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-indigo-400"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="truncate font-medium">
                                        {group.category.name}
                                    </span>
                                    <span
                                        className={clsx(
                                            'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums transition',
                                            isActive
                                                ? 'bg-white/15 text-white'
                                                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200',
                                        )}
                                    >
                                        {formatPersianNumber(group.products.length)}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-2 border-t border-slate-100 px-3 pb-1 pt-3 text-xs text-slate-400">
                    <span className="font-semibold text-slate-600">
                        {formatPersianNumber(totalProducts)}
                    </span>{' '}
                    products in {formatPersianNumber(groups.length)}{' '}
                    {groups.length === 1 ? 'category' : 'categories'}
                </div>
            </div>
        </nav>
    );
}
