import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../api/storefront';
import type { PublicCategory } from '../types/storefront';
import { FarmixHomepageCategoryGrid } from './FarmixCategoryGrid';

export function FarmixCategories() {
    const [categories, setCategories] = useState<PublicCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchCategories()
            .then((items) => {
                setCategories(items);
                setError(false);
            })
            .catch(() => {
                setCategories([]);
                setError(true);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <section className="categorie-layout2 space farmix-categories-section">
            <div className="container">
                <div className="d-flex title-area align-items-end farmix-categories-head">
                    <div className="title-link">
                        <Link to="/categories">
                            همه دسته‌ها
                            <i className="far fa-angle-double-left" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="title-right">
                        <span className="sec-subtitle">دسته‌بندی‌های ما</span>
                        <h2 className="sec-title">مرور دسته‌بندی‌های محصولات</h2>
                    </div>
                </div>

                {isLoading ? (
                    <p className="farmix-categories-status">در حال بارگذاری دسته‌بندی‌ها...</p>
                ) : error ? (
                    <p className="farmix-categories-status farmix-categories-status--error">
                        بارگذاری دسته‌بندی‌ها ممکن نشد. لطفاً بعداً دوباره تلاش کنید.
                    </p>
                ) : categories.length === 0 ? (
                    <p className="farmix-categories-status">فعلاً دسته‌بندی فعالی ثبت نشده است.</p>
                ) : (
                    <FarmixHomepageCategoryGrid categories={categories} />
                )}
            </div>
        </section>
    );
}
