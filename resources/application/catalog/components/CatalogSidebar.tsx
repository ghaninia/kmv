import { Leaf } from 'lucide-react';
import type { CategoryGroup } from '../types/catalog';
import { CategoryNavList } from './CategoryNavList';

type CatalogSidebarProps = {
    groups: CategoryGroup[];
    activeCategoryId: string | null;
    onSelectCategory: (categoryId: string) => void;
};

/**
 * Category navigation sidebar for desktop.
 */
export function CatalogSidebar({
    groups,
    activeCategoryId,
    onSelectCategory,
}: CatalogSidebarProps) {
    return (
        <nav aria-label="دسته‌بندی محصولات" className="hidden lg:block lg:sticky lg:top-24">
            <div className="rounded-2xl border border-brand-100 bg-white p-3 shadow-sm shadow-brand-900/5">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
                    <Leaf aria-hidden="true" className="size-3.5" />
                    دسته‌بندی‌ها
                </div>

                <div className="mt-1">
                    <CategoryNavList
                        groups={groups}
                        activeCategoryId={activeCategoryId}
                        onSelectCategory={onSelectCategory}
                    />
                </div>
            </div>
        </nav>
    );
}
