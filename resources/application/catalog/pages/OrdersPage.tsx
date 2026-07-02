import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ClipboardList, RefreshCw, ShoppingBag } from 'lucide-react';
import { CatalogPasswordGate } from '../components/CatalogPasswordGate';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { OrderListSkeleton } from '../components/OrderListSkeleton';
import { OrdersShell } from '../components/OrdersShell';
import { PreInvoiceListCard } from '../components/PreInvoiceListCard';
import { useCatalog } from '../hooks/useCatalog';
import { fetchCatalogOrderHistory } from '../utils/api';
import type { CatalogOrder } from '../types/order';
import { formatPersianNumber, formatToman } from '../utils/currency';
import { groupOrdersByDate } from '../utils/orderDates';
import { getStoredPassword } from '../utils/storage';

export function OrdersPage() {
    const { slug } = useParams<{ slug: string }>();
    const access = useCatalog(slug);
    const catalogPath = slug ? `/${slug}` : '/';

    const [orders, setOrders] = useState<CatalogOrder[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const summary = useMemo(() => {
        const pendingCount = orders.filter((order) => order.status === 'pending').length;
        const totalAmount = orders.reduce((sum, order) => sum + order.subtotalToman, 0);

        return {
            total: orders.length,
            pendingCount,
            totalAmount,
        };
    }, [orders]);

    const groupedOrders = useMemo(() => groupOrdersByDate(orders), [orders]);

    async function loadOrders() {
        if (!slug || access.status !== 'ready') return;

        setIsLoadingOrders(true);
        setError(null);

        try {
            const data = await fetchCatalogOrderHistory(
                slug,
                getStoredPassword(slug) ?? undefined,
            );
            setOrders(data);
        } catch (loadError) {
            setError(
                loadError instanceof Error ? loadError.message : 'بارگذاری سفارش‌ها ناموفق بود.',
            );
        } finally {
            setIsLoadingOrders(false);
        }
    }

    useEffect(() => {
        if (access.status !== 'ready' || !slug) {
            return;
        }

        loadOrders();
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
        <OrdersShell
            title="سفارش‌های من"
            subtitle="پیش‌فاکتورهای ثبت‌شده از این لینک"
            catalogTitle={access.catalog?.title}
            backTo={catalogPath}
            backLabel="بازگشت به کاتالوگ"
        >
            {isLoadingOrders ? (
                <OrderListSkeleton />
            ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 sm:px-5">
                    <p className="text-sm text-rose-700">{error}</p>
                    <button
                        type="button"
                        onClick={loadOrders}
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-800"
                    >
                        <RefreshCw className="size-4" />
                        تلاش مجدد
                    </button>
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-brand-200 bg-white px-6 py-16 text-center shadow-sm">
                    <div className="flex size-20 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                        <ClipboardList className="size-9" />
                    </div>
                    <h2 className="mt-5 text-lg font-bold text-brand-950">هنوز سفارشی ثبت نشده</h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        از کاتالوگ محصولات را به سبد خرید اضافه کنید و پیش‌فاکتور خود را ثبت
                        کنید. سفارش‌ها اینجا نمایش داده می‌شوند.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to={catalogPath}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
                        >
                            <ShoppingBag className="size-4" />
                            شروع خرید
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
                            <p className="text-xs font-medium text-slate-500">کل سفارش‌ها</p>
                            <p className="mt-1 text-2xl font-black text-brand-950">
                                {formatPersianNumber(summary.total)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 shadow-sm">
                            <p className="text-xs font-medium text-amber-700">در انتظار</p>
                            <p className="mt-1 text-2xl font-black text-amber-900">
                                {formatPersianNumber(summary.pendingCount)}
                            </p>
                        </div>
                        <div className="col-span-2 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm sm:col-span-1">
                            <p className="text-xs font-medium text-slate-500">جمع مبالغ</p>
                            <p className="mt-1 text-lg font-black text-brand-900 sm:text-xl">
                                {formatToman(summary.totalAmount)}
                            </p>
                        </div>
                    </div>

                    {groupedOrders.map((group) => (
                        <section key={group.label} className="space-y-3">
                            <div className="flex items-center gap-3 px-1">
                                <h2 className="text-sm font-bold text-brand-900">{group.label}</h2>
                                <span className="h-px flex-1 bg-brand-100" />
                                <span className="text-xs text-slate-400">
                                    {formatPersianNumber(group.orders.length)} سفارش
                                </span>
                            </div>
                            <ul className="space-y-3">
                                {group.orders.map((order) => (
                                    <li key={order.id}>
                                        <PreInvoiceListCard
                                            order={order}
                                            to={`/${slug}/orders/${order.id}`}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </OrdersShell>
    );
}
