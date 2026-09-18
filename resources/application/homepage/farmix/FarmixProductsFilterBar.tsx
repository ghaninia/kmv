import { FormEvent } from 'react';
import type { PublicCategory } from '../types/storefront';
import { formatPersianNumber } from '../utils/format';

type FarmixProductsFilterBarProps = {
    categories: PublicCategory[];
    activeSlug: string;
    search: string;
    onSearchSubmit: (value: string) => void;
    onCategoryChange: (slug: string) => void;
};

export function FarmixProductsFilterBar({
    categories,
    activeSlug,
    search,
    onSearchSubmit,
    onCategoryChange,
}: FarmixProductsFilterBarProps) {
    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSearchSubmit(String(formData.get('search') || ''));
    };

    return (
        <div className="farmix-products-top-filters" role="search" aria-label="فیلتر محصولات">
            <form className="farmix-products-filter-bar__search" onSubmit={handleSearchSubmit}>
                <span className="farmix-products-filter-bar__search-icon" aria-hidden="true">
                    <i className="far fa-search" />
                </span>
                <input
                    className="farmix-products-filter-bar__input form-control"
                    type="search"
                    name="search"
                    placeholder="نام محصول را جستجو کنید..."
                    defaultValue={search}
                    aria-label="جستجو در محصولات"
                    autoComplete="off"
                />
                <button type="submit" className="farmix-products-filter-bar__submit" aria-label="جستجو">
                    <span className="farmix-products-filter-bar__submit-label">جستجو</span>
                    <i className="far fa-arrow-left farmix-products-filter-bar__submit-icon" aria-hidden="true" />
                </button>
            </form>

            <div className="farmix-products-filter-bar__category">
                <span className="farmix-products-filter-bar__category-icon" aria-hidden="true">
                    <i className="far fa-folder-open" />
                </span>
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
        </div>
    );
}
