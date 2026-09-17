import { FormEvent } from 'react';
import type { PublicCategory } from '../types/storefront';
import { formatPersianNumber } from '../utils/format';

type FarmixProductsFilterBarProps = {
    categories: PublicCategory[];
    activeSlug: string;
    search: string;
    onSearchSubmit: (value: string) => void;
    onCategoryChange: (slug: string) => void;
    onClearFilters: () => void;
};

export function FarmixProductsFilterBar({
    categories,
    activeSlug,
    search,
    onSearchSubmit,
    onCategoryChange,
    onClearFilters,
}: FarmixProductsFilterBarProps) {
    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSearchSubmit(String(formData.get('search') || ''));
    };

    const hasActiveFilters = Boolean(search.trim() || activeSlug);

    return (
        <div className="farmix-products-top-filters" role="search" aria-label="فیلتر محصولات">
            <form className="farmix-products-filter-bar__search" onSubmit={handleSearchSubmit}>
                <i className="far fa-search" aria-hidden="true" />
                <input
                    className="form-control"
                    type="search"
                    name="search"
                    placeholder="جستجو در محصولات..."
                    defaultValue={search}
                    aria-label="جستجو در محصولات"
                />
                <button type="submit" className="farmix-products-filter-bar__submit" aria-label="جستجو">
                    جستجو
                </button>
            </form>

            <div className="farmix-products-filter-bar__category">
                <i className="far fa-folder-open" aria-hidden="true" />
                <select
                    className="form-control farmix-products-select"
                    value={activeSlug}
                    onChange={(event) => onCategoryChange(event.target.value)}
                    aria-label="دسته‌بندی"
                >
                    <option value="">همه دسته‌ها</option>
                    {categories.map((item) => (
                        <option key={item.id} value={item.slug}>
                            {item.name}
                            {item.products_count > 0 ? ` · ${formatPersianNumber(item.products_count)}` : ''}
                        </option>
                    ))}
                </select>
            </div>

            {hasActiveFilters ? (
                <button type="button" className="farmix-products-filter-bar__clear" onClick={onClearFilters}>
                    پاک کردن فیلتر
                </button>
            ) : null}
        </div>
    );
}
