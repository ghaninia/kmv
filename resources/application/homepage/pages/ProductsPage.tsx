import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api/storefront';
import { Pagination } from '../components/Pagination';
import { FarmixPageHero } from '../farmix/FarmixPageHero';
import { FarmixProductBackgroundShapes } from '../farmix/FarmixProductBackgroundShapes';
import { FarmixProductCard } from '../farmix/FarmixProductCard';
import { FarmixProductsFilterBar } from '../farmix/FarmixProductsFilterBar';
import type { PublicCategory, PublicProduct } from '../types/storefront';
import { PUBLIC_PRODUCT_MAX_PAGES, PUBLIC_PRODUCTS_PER_PAGE } from '../constants/storefrontPagination';
import { formatPersianNumber } from '../utils/format';

export function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<PublicProduct[]>([]);
    const [categories, setCategories] = useState<PublicCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const rawPage = Number(searchParams.get('page') || '1');
    const page = Math.min(Math.max(rawPage, 1), PUBLIC_PRODUCT_MAX_PAGES);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    useEffect(() => {
        fetchCategories().then(setCategories).catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchProducts({ page, search, category })
            .then((result) => {
                setProducts(result.products);
                setMeta({
                    current_page: result.meta?.current_page ?? 1,
                    last_page: result.meta?.last_page ?? 1,
                    total: result.meta?.total ?? result.products.length,
                });
            })
            .catch(() => setProducts([]))
            .finally(() => setIsLoading(false));
    }, [page, search, category]);

    useEffect(() => {
        if (rawPage !== page) {
            const next = new URLSearchParams(searchParams);
            next.set('page', String(page));
            setSearchParams(next, { replace: true });
        }
    }, [rawPage, page, searchParams, setSearchParams]);

    const updateParams = (updates: Record<string, string>) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                next.set(key, value);
            } else {
                next.delete(key);
            }
        });
        setSearchParams(next);
    };

    const activeCategoryName = categories.find((item) => item.slug === category)?.name;

    const heroSubtitle =
        meta.total > 0
            ? `${formatPersianNumber(meta.total)} محصول${activeCategoryName ? ` در «${activeCategoryName}»` : ''}`
            : 'جستجو و فیلتر در میان محصولات کارا ماشین وصال';

    return (
        <>
            <FarmixPageHero title="همه محصولات" subtitle={heroSubtitle} align="center" />
            <section className="product-layout2 space farmix-products-page farmix-storefront-page">
                <div className="container">
                    <FarmixProductsFilterBar
                        categories={categories}
                        activeSlug={category}
                        search={search}
                        onSearchSubmit={(value) => updateParams({ search: value, page: '1' })}
                        onCategoryChange={(slug) => updateParams({ category: slug, page: '1' })}
                        onClearFilters={() => updateParams({ search: '', category: '', page: '1' })}
                    />

                    {!isLoading && meta.total > 0 ? (
                        <p className="farmix-products-listing-count">
                            {formatPersianNumber(products.length)} از {formatPersianNumber(meta.total)} محصول
                        </p>
                    ) : null}

                    {isLoading ? (
                        <div className="farmix-products-grid row g-4" aria-busy="true">
                            {Array.from({ length: PUBLIC_PRODUCTS_PER_PAGE }).map((_, index) => (
                                <div key={index} className="col-6 col-md-6 col-lg-4 col-xl-3">
                                    <div className="farmix-product-card-skeleton" />
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="farmix-products-empty farmix-storefront-empty">
                            <i className="far fa-box-open farmix-storefront-empty-icon" aria-hidden="true" />
                            <p>محصولی با این فیلتر پیدا نشد.</p>
                            <button
                                type="button"
                                className="vs-btn style2"
                                onClick={() => updateParams({ search: '', category: '', page: '1' })}
                            >
                                پاک کردن فیلترها
                            </button>
                        </div>
                    ) : (
                        <div className="farmix-products-grid row g-4 farmix-storefront-grid">
                            {products.map((product) => (
                                <div key={product.id} className="col-6 col-md-6 col-lg-4 col-xl-3 d-flex">
                                    <FarmixProductCard
                                        name={product.name}
                                        href={product.href}
                                        image={product.image}
                                        categoryLabel={product.category?.name}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <Pagination
                        className="farmix-pagination"
                        currentPage={meta.current_page}
                        lastPage={meta.last_page}
                        maxPage={PUBLIC_PRODUCT_MAX_PAGES}
                        onPageChange={(nextPage) =>
                            updateParams({
                                page: String(Math.min(nextPage, PUBLIC_PRODUCT_MAX_PAGES)),
                            })
                        }
                    />
                </div>
                <FarmixProductBackgroundShapes />
            </section>
        </>
    );
}
