import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchCategory } from '../api/storefront';
import { Pagination } from '../components/Pagination';
import { NotFoundIllustration } from '../components/NotFoundIllustration';
import { FarmixPageHero } from '../farmix/FarmixPageHero';
import { FarmixProductBackgroundShapes } from '../farmix/FarmixProductBackgroundShapes';
import { FarmixProductCard } from '../farmix/FarmixProductCard';
import { FarmixProductsFilterBar } from '../farmix/FarmixProductsFilterBar';
import type { PublicCategory, PublicProduct } from '../types/storefront';
import { PUBLIC_PRODUCT_MAX_PAGES, PUBLIC_PRODUCTS_PER_PAGE } from '../constants/storefrontPagination';
import { formatPersianNumber } from '../utils/format';

export function CategoryPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [category, setCategory] = useState<PublicCategory | null>(null);
    const [categories, setCategories] = useState<PublicCategory[]>([]);
    const [products, setProducts] = useState<PublicProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const rawPage = Number(searchParams.get('page') || '1');
    const page = Math.min(Math.max(rawPage, 1), PUBLIC_PRODUCT_MAX_PAGES);
    const search = searchParams.get('search') || '';
    const activeSlug = slug || '';

    useEffect(() => {
        fetchCategories().then(setCategories).catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        if (rawPage > PUBLIC_PRODUCT_MAX_PAGES || rawPage < 1) {
            const next = new URLSearchParams(searchParams);
            next.set('page', String(page));
            setSearchParams(next);
        }
    }, [rawPage, page, searchParams, setSearchParams]);

    useEffect(() => {
        if (!slug) {
            return;
        }

        setIsLoading(true);
        fetchCategory(slug, { page, search })
            .then((data) => {
                setCategory(data.category);
                setProducts(data.products);
                setMeta({
                    current_page: data.meta?.current_page ?? 1,
                    last_page: data.meta?.last_page ?? 1,
                    total: data.meta?.total ?? data.products.length,
                });
                setNotFound(false);
            })
            .catch(() => {
                setCategory(null);
                setProducts([]);
                setNotFound(true);
            })
            .finally(() => setIsLoading(false));
    }, [slug, page, search]);

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

    const buildCategoryPath = (categorySlug: string, searchQuery: string) => {
        const query = new URLSearchParams();
        if (searchQuery.trim()) {
            query.set('search', searchQuery.trim());
        }
        const qs = query.toString();

        return `/categories/${categorySlug}${qs ? `?${qs}` : ''}`;
    };

    const handleCategoryChange = (newSlug: string) => {
        if (!newSlug) {
            const query = new URLSearchParams();
            if (search.trim()) {
                query.set('search', search.trim());
            }
            const qs = query.toString();
            navigate(`/products${qs ? `?${qs}` : ''}`);
            return;
        }

        navigate(buildCategoryPath(newSlug, search));
    };

    const heroSubtitle = notFound
        ? 'این دسته در فهرست موجود نیست'
        : isLoading
          ? 'در حال بارگذاری محصولات...'
          : category?.description ||
            (meta.total > 0
                ? `${formatPersianNumber(meta.total)} محصول در این دسته`
                : 'محصولات این دسته');

    if (notFound) {
        return (
            <>
                <FarmixPageHero
                    title="دسته‌بندی یافت نشد"
                    subtitle={heroSubtitle}
                    align="center"
                />
                <section className="farmix-storefront-page space">
                    <div className="container">
                        <div className="farmix-not-found-block text-center">
                            <NotFoundIllustration />
                            <Link to="/categories" className="vs-btn">بازگشت به دسته‌بندی‌ها</Link>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <FarmixPageHero
                title={category?.name || 'دسته‌بندی'}
                subtitle={heroSubtitle}
                align="center"
            />
            <section className="product-layout2 space farmix-products-page farmix-storefront-page">
                <div className="container">
                    <FarmixProductsFilterBar
                        categories={categories}
                        activeSlug={activeSlug}
                        search={search}
                        onSearchSubmit={(value) => updateParams({ search: value, page: '1' })}
                        onCategoryChange={handleCategoryChange}
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
                            <p>محصولی با این فیلتر در این دسته پیدا نشد.</p>
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
