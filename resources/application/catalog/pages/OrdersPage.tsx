import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { CatalogPasswordGate } from '../components/CatalogPasswordGate';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { PreInvoiceListCard } from '../components/PreInvoiceListCard';
import { useCatalog } from '../hooks/useCatalog';
import { fetchCatalogOrderHistory } from '../utils/api';
import type { CatalogOrder } from '../types/order';
import { getStoredPassword } from '../utils/storage';

export function OrdersPage() {
    const { slug } = useParams<{ slug: string }>();
    const access = useCatalog(slug);
    const catalogPath = slug ? `/${slug}` : '/';

    const [orders, setOrders] = useState<CatalogOrder[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (access.status !== 'ready' || !slug) {
            return;
        }

        let cancelled = false;

        async function loadOrders() {
            setIsLoadingOrders(true);
            setError(null);

            try {
                const data = await fetchCatalogOrderHistory(
                    slug,
                    getStoredPassword(slug) ?? undefined,
                );
                if (!cancelled) {
                    setOrders(data);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'بارگذاری سفارش‌ها ناموفق بود.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingOrders(false);
                }
            }
        }

        loadOrders();

        return () => {
            cancelled = true;
        };
    }, [access.status, slug]);

    if (access.status === 'loading') {
        return <LoadingState />;
    }

    if (access.status === 'password-required') {
        return (
            <CatalogPasswordGate
                catalogTitle={access.catalog?.title}
                onSubmit={access.submitPassword}
                isVerifying={access.isVerifying}
                error={access.passwordError}
                description="برای مشاهده سفارش‌های این لینک، ابتدا باید رمز عبور کاتالوگ را وارد کنید."
                submitLabel="ورود و مشاهده سفارش‌ها"
                backTo={catalogPath}
            />
        );
    }

    if (access.status !== 'ready') {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-[#f8fcf9] px-4 py-12">
                <div className="w-full max-w-lg">
                    <EmptyState
                        title="دسترسی به سفارش‌ها ممکن نیست"
                        description="در حال حاضر امکان مشاهده سفارش‌ها وجود ندارد."
                        action={
                            <Link
                                to={catalogPath}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
                            >
                                بازگشت به کاتالوگ
                                <ArrowRight className="size-4" />
                            </Link>
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-dvh flex-col bg-[#f4faf5]">
            <header className="sticky top-0 z-20 border-b border-brand-100 bg-white/95 backdrop-blur-xl">
                <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
                    <Link
                        to={catalogPath}
                        className="inline-flex size-10 items-center justify-center rounded-xl border border-brand-100 text-brand-700 transition hover:bg-brand-50"
                        aria-label="بازگشت به کاتالوگ"
                    >
                        <ArrowRight className="size-5" />
                    </Link>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-lg font-black text-brand-950">سفارش‌های این لینک</h1>
                        <p className="text-xs text-slate-400">پیش‌فاکتورهای ثبت‌شده</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
                {isLoadingOrders ? (
                    <div className="py-16 text-center text-sm text-slate-500">در حال بارگذاری...</div>
                ) : error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex size-20 items-center justify-center rounded-full bg-brand-50 text-brand-400">
                            <ClipboardList className="size-9" />
                        </div>
                        <h2 className="mt-5 text-lg font-bold text-brand-950">هنوز سفارشی ثبت نشده</h2>
                        <p className="mt-2 max-w-xs text-sm text-slate-500">
                            پس از ثبت پیش‌فاکتور از سبد خرید، سفارش‌ها اینجا نمایش داده می‌شود.
                        </p>
                        <Link
                            to={catalogPath}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
                        >
                            مشاهده کاتالوگ
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {orders.map((order) => (
                            <li key={order.id}>
                                <PreInvoiceListCard
                                    order={order}
                                    to={`/${slug}/orders/${order.id}`}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}
