import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/storefront';
import { FarmixCategoryGrid } from '../farmix/FarmixCategoryGrid';
import { FarmixPageHero } from '../farmix/FarmixPageHero';
import type { PublicCategory } from '../types/storefront';
import { formatPersianNumber } from '../utils/format';

export function CategoriesPage() {
    const [categories, setCategories] = useState<PublicCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch(() => setCategories([]))
            .finally(() => setIsLoading(false));
    }, []);

    const heroSubtitle = isLoading
        ? 'در حال بارگذاری دسته‌بندی‌ها...'
        : categories.length > 0
          ? `${formatPersianNumber(categories.length)} دسته برای مرور محصولات`
          : 'به‌زودی دسته‌بندی‌های جدید اضافه می‌شود';

    return (
        <>
            <FarmixPageHero
                title="دسته‌بندی‌ها"
                subtitle={heroSubtitle}
                align="center"
            />
            <section className="categorie-layout2 space farmix-categories-section farmix-categories-list-page farmix-storefront-page">
                <div className="container">
                    {isLoading ? (
                        <div className="farmix-storefront-loading">
                            <span className="farmix-storefront-loading-spinner" aria-hidden="true" />
                            در حال بارگذاری دسته‌بندی‌ها...
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="farmix-products-empty farmix-storefront-empty">
                            <i className="far fa-folder-open farmix-storefront-empty-icon" aria-hidden="true" />
                            <h2 className="farmix-storefront-empty-title">دسته‌بندی فعالی وجود ندارد</h2>
                            <p>فعلاً دسته‌ای برای نمایش ثبت نشده است.</p>
                        </div>
                    ) : (
                        <FarmixCategoryGrid categories={categories} />
                    )}
                </div>
            </section>
        </>
    );
}
