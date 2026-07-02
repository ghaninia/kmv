import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FileQuestion, PackageSearch, SearchX, TimerOff } from 'lucide-react';
import type { Product } from '../types/catalog';
import { useCatalog } from '../hooks/useCatalog';
import { useCatalogSearch } from '../hooks/useCatalogSearch';
import { useActiveCategory } from '../hooks/useActiveCategory';
import { CatalogHeader } from '../components/CatalogHeader';
import { CatalogSidebar } from '../components/CatalogSidebar';
import { CategorySection } from '../components/CategorySection';
import { CatalogPasswordGate } from '../components/CatalogPasswordGate';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { useCart } from '../hooks/useCart';

/**
 * Top-level catalog route.
 *
 * Reads the `:slug` from the URL, drives the data/password lifecycle via
 * `useCatalog`, and renders the appropriate experience: loading skeleton,
 * password gate, error/empty states, or the full storefront (sticky header +
 * sticky sidebar + category-grouped product grid with client-side search).
 */
export function CatalogPage() {
    const { slug } = useParams<{ slug: string }>();
    const { catalog, status, passwordError, isVerifying, submitPassword, retry } =
        useCatalog(slug);

    const { query, setQuery, groups, resultCount, isEmpty, isSearching } =
        useCatalogSearch(catalog);

    const categoryIds = useMemo(
        () => groups.map((group) => group.category.id),
        [groups],
    );
    const { activeCategoryId, scrollToCategory } = useActiveCategory(categoryIds);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const cart = useCart(slug);

    const cartQuantities = useMemo(() => {
        return cart.items.reduce<Record<string, number>>((acc, item) => {
            acc[item.productId] = item.quantity;
            return acc;
        }, {});
    }, [cart.items]);

    const totalProducts = catalog?.products.length ?? 0;

    function handleViewProduct(product: Product) {
        setSelectedProduct(product);
    }

    function handleAddToCart(product: Product, quantity = 1) {
        cart.addItem(product, quantity);
    }

    if (status === 'loading') {
        return <LoadingState />;
    }

    if (status === 'password-required') {
        return (
            <CatalogPasswordGate
                catalogTitle={catalog?.title}
                onSubmit={submitPassword}
                isVerifying={isVerifying}
                error={passwordError}
            />
        );
    }

    if (status === 'not-found') {
        return (
            <CenteredState>
                <EmptyState
                    icon={FileQuestion}
                    tone="danger"
                    title="کاتالوگ پیدا نشد"
                    description="کاتالوگی که به دنبال آن هستید وجود ندارد یا لینک نادرست است. آدرس را بررسی کرده و دوباره تلاش کنید."
                />
            </CenteredState>
        );
    }

    if (status === 'expired') {
        return (
            <CenteredState>
                <EmptyState
                    icon={TimerOff}
                    tone="danger"
                    title="این لینک منقضی شده است"
                    description="لینک این کاتالوگ دیگر فعال نیست. لطفاً از تامین‌کننده خود لینک جدید درخواست کنید."
                />
            </CenteredState>
        );
    }

    if (status === 'error' || !catalog) {
        return (
            <CenteredState>
                <EmptyState
                    icon={FileQuestion}
                    tone="danger"
                    title="مشکلی پیش آمد"
                    description="در حال حاضر بارگذاری این کاتالوگ ممکن نشد. اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید."
                    action={
                        <button
                            type="button"
                            onClick={retry}
                            className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2"
                        >
                            تلاش دوباره
                        </button>
                    }
                />
            </CenteredState>
        );
    }

    const hasProducts = catalog.products.length > 0;

    return (
        <div className="min-h-dvh bg-[#f4faf5]">
            <a
                href="#catalog-content"
                className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
                پرش به محصولات
            </a>

            <CatalogHeader
                catalog={catalog}
                totalProducts={totalProducts}
                searchQuery={query}
                onSearchChange={setQuery}
                resultCount={resultCount}
                cartCount={cart.totals.count}
                cartTo={slug ? `/${slug}/cart` : undefined}
            />

            <div className="mx-auto grid max-w-screen-2xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
                {/* Sidebar — hidden when there are no categories to show. */}
                {groups.length > 0 && (
                    <aside className="lg:py-0">
                        <CatalogSidebar
                            groups={groups}
                            activeCategoryId={activeCategoryId}
                            onSelectCategory={scrollToCategory}
                        />
                    </aside>
                )}

                <main
                    id="catalog-content"
                    className={groups.length === 0 ? 'lg:col-span-2' : undefined}
                    tabIndex={-1}
                >
                    {!hasProducts ? (
                        <EmptyState
                            icon={PackageSearch}
                            title="هنوز محصولی وجود ندارد"
                            description="در حال حاضر این کاتالوگ هیچ محصولی ندارد. لطفاً بعداً دوباره سر بزنید."
                        />
                    ) : isEmpty ? (
                        <EmptyState
                            icon={SearchX}
                            title="نتیجه‌ای یافت نشد"
                            description={`هیچ محصولی با «${query}» مطابقت ندارد. کلمه دیگری امتحان کنید یا جستجو را پاک کنید.`}
                            action={
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2"
                                >
                                    پاک کردن جستجو
                                </button>
                            }
                        />
                    ) : (
                        <div className="space-y-12">
                            {isSearching && (
                                <p className="text-sm text-slate-500" aria-live="polite">
                                    نمایش{' '}
                                    <span className="font-semibold text-slate-900">
                                        {resultCount}
                                    </span>{' '}
                                    نتیجه برای{' '}
                                    <span className="font-semibold text-slate-900">
                                        &laquo;{query}&raquo;
                                    </span>
                                </p>
                            )}
                            <AnimatePresence mode="popLayout">
                                {groups.map((group) => (
                                    <motion.div
                                        key={group.category.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <CategorySection
                                            group={group}
                                            onViewProduct={handleViewProduct}
                                            onAddToCart={(product) => handleAddToCart(product)}
                                            cartQuantities={cartQuantities}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </main>
            </div>

            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
}

/** Simple full-height wrapper to vertically center standalone states. */
function CenteredState({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh items-center justify-center bg-[#f4faf5] px-4 py-12">
            <div className="w-full max-w-lg">{children}</div>
        </div>
    );
}
