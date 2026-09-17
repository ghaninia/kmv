import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { fetchCategory } from '../api/storefront';
import { Pagination } from '../components/Pagination';
import { FarmixPageHero } from '../farmix/FarmixPageHero';
import { FarmixProductCard } from '../farmix/FarmixProductCard';
import { FarmixStorefrontSearch } from '../farmix/FarmixStorefrontSearch';
import type { PublicCategory, PublicProduct } from '../types/storefront';
import { PUBLIC_PRODUCT_MAX_PAGES } from '../constants/storefrontPagination';
import { formatPersianNumber } from '../utils/format';

export function CategoryPage() {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [category, setCategory] = useState<PublicCategory | null>(null);
    const [products, setProducts] = useState<PublicProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const rawPage = Number(searchParams.get('page') || '1');
    const page = Math.min(Math.max(rawPage, 1), PUBLIC_PRODUCT_MAX_PAGES);
    const search = searchParams.get('search') || '';

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
                    <div className="container text-center">
                        <Link to="/categories" className="vs-btn">بازگشت به دسته‌بندی‌ها</Link>
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
                    <div className="farmix-category-listing-bar">
                        <FarmixStorefrontSearch
                            placeholder="جستجو در این دسته..."
                            defaultValue={search}
                            onSubmit={(value) => {
                                const next = new URLSearchParams(searchParams);
                                next.set('search', value);
                                next.set('page', '1');
                                setSearchParams(next);
                            }}
                        />
                        <Link to="/categories" className="farmix-category-listing-bar__back">
                            <i className="far fa-arrow-right" aria-hidden="true" />
                            همه دسته‌ها
                        </Link>
                    </div>

                    {!isLoading && meta.total > 0 ? (
                        <p className="farmix-storefront-result-count">
                            {formatPersianNumber(meta.total)} محصول
                        </p>
                    ) : null}

                    {isLoading ? (
                        <div className="farmix-products-grid row g-4" aria-busy="true">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="col-6 col-md-6 col-lg-4">
                                    <div className="farmix-product-card-skeleton" />
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="farmix-products-empty farmix-storefront-empty">
                            <i className="far fa-box-open farmix-storefront-empty-icon" aria-hidden="true" />
                            <h2 className="farmix-storefront-empty-title">محصولی در این دسته نیست</h2>
                            <p>فعلاً آیتمی برای این دسته ثبت نشده است.</p>
                            <Link to="/products" className="vs-btn style2">مشاهده همه محصولات</Link>
                        </div>
                    ) : (
                        <div className="farmix-products-grid row g-4 farmix-storefront-grid">
                            {products.map((product) => (
                                <div key={product.id} className="col-6 col-md-6 col-lg-4 d-flex">
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
                        onPageChange={(nextPage) => {
                            const next = new URLSearchParams(searchParams);
                            next.set(
                                'page',
                                String(Math.min(nextPage, PUBLIC_PRODUCT_MAX_PAGES)),
                            );
                            setSearchParams(next);
                        }}
                    />
                </div>
            </section>
        </>
    );
}
