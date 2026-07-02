import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, FileQuestion, Receipt } from 'lucide-react';
import { CatalogPasswordGate } from '../components/CatalogPasswordGate';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { useCatalog } from '../hooks/useCatalog';
import { fetchCatalogOrder } from '../utils/api';
import type { CatalogOrder } from '../types/order';
import { formatPersianNumber, formatToman } from '../utils/currency';
import { getStoredPassword } from '../utils/storage';

export function OrderDetailPage() {
    const { slug, orderId } = useParams<{ slug: string; orderId: string }>();
    const access = useCatalog(slug);
    const catalogPath = slug ? `/${slug}` : '/';
    const ordersPath = slug ? `/${slug}/orders` : '/';

    const [order, setOrder] = useState<CatalogOrder | null>(null);
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (access.status !== 'ready' || !slug || !orderId) {
            return;
        }

        let cancelled = false;

        async function loadOrder() {
            setIsLoadingOrder(true);
            setError(null);

            try {
                const data = await fetchCatalogOrder(
                    slug,
                    orderId,
                    getStoredPassword(slug) ?? undefined,
                );
                if (!cancelled) {
                    setOrder(data);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'بارگذاری جزئیات سفارش ناموفق بود.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingOrder(false);
                }
            }
        }

        loadOrder();

        return () => {
            cancelled = true;
        };
    }, [access.status, slug, orderId]);

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
                description="برای مشاهده جزئیات سفارش، ابتدا باید رمز عبور این کاتالوگ را وارد کنید."
                submitLabel="ورود و مشاهده سفارش"
                backTo={ordersPath}
            />
        );
    }

    if (access.status !== 'ready') {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-[#f8fcf9] px-4 py-12">
                <div className="w-full max-w-lg">
                    <EmptyState
                        title="دسترسی به سفارش ممکن نیست"
                        description="در حال حاضر امکان مشاهده این سفارش وجود ندارد."
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
                        to={ordersPath}
                        className="inline-flex size-10 items-center justify-center rounded-xl border border-brand-100 text-brand-700 transition hover:bg-brand-50"
                        aria-label="بازگشت به لیست سفارش‌ها"
                    >
                        <ArrowRight className="size-5" />
                    </Link>
                    <div className="min-w-0 flex-1">
                        <h1 className="truncate text-lg font-black text-brand-950">
                            {order?.orderNumber ?? 'پیش‌فاکتور'}
                        </h1>
                        <p className="text-xs text-slate-400">جزئیات پیش‌فاکتور</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
                {isLoadingOrder ? (
                    <div className="py-16 text-center text-sm text-slate-500">در حال بارگذاری...</div>
                ) : error || !order ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex size-20 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                            <FileQuestion className="size-9" />
                        </div>
                        <p className="mt-5 text-sm text-rose-700">{error ?? 'سفارش پیدا نشد.'}</p>
                        <Link
                            to={ordersPath}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
                        >
                            بازگشت به سفارش‌ها
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                ) : (
                    <article className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
                        <div className="border-b-2 border-brand-700 bg-gradient-to-l from-brand-50 to-white px-5 py-5 sm:px-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <span className="grid size-12 place-items-center rounded-2xl bg-brand-700 text-white shadow-md">
                                        <Receipt className="size-6" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                                            پیش‌فاکتور
                                        </p>
                                        <h2 className="font-mono text-xl font-black text-brand-950">
                                            {order.orderNumber}
                                        </h2>
                                    </div>
                                </div>
                                <OrderStatusBadge status={order.status} label={order.statusLabel} />
                            </div>
                        </div>

                        <div className="grid gap-4 border-b border-brand-50 px-5 py-5 sm:grid-cols-2 sm:px-6">
                            <div>
                                <p className="text-xs text-slate-400">نام مشتری</p>
                                <p className="mt-1 font-medium text-slate-800">{order.customerName}</p>
                            </div>
                            {order.customerPhone && (
                                <div>
                                    <p className="text-xs text-slate-400">تلفن</p>
                                    <p className="mt-1 font-medium text-slate-800" dir="ltr">
                                        {order.customerPhone}
                                    </p>
                                </div>
                            )}
                            {order.createdAt && (
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-slate-400">تاریخ ثبت</p>
                                    <p className="mt-1 font-medium text-slate-800">
                                        {new Date(order.createdAt).toLocaleString('fa-IR')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {order.customerNote && (
                            <div className="border-b border-brand-50 px-5 py-4 sm:px-6">
                                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    <strong>توضیحات:</strong> {order.customerNote}
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-brand-100 bg-[#f8fcf9] text-slate-500">
                                        <th className="px-5 py-3 text-right font-semibold sm:px-6">#</th>
                                        <th className="px-5 py-3 text-right font-semibold sm:px-6">محصول</th>
                                        <th className="px-5 py-3 text-right font-semibold sm:px-6">تعداد</th>
                                        <th className="px-5 py-3 text-right font-semibold sm:px-6">قیمت واحد</th>
                                        <th className="px-5 py-3 text-right font-semibold sm:px-6">جمع</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(order.items ?? []).map((item, index) => (
                                        <tr key={item.id} className="border-b border-brand-50 last:border-b-0">
                                            <td className="px-5 py-3 text-slate-500 sm:px-6">
                                                {formatPersianNumber(index + 1)}
                                            </td>
                                            <td className="px-5 py-3 font-medium text-slate-800 sm:px-6">
                                                {item.productName}
                                            </td>
                                            <td className="px-5 py-3 sm:px-6">
                                                {formatPersianNumber(item.quantity)}
                                            </td>
                                            <td className="px-5 py-3 sm:px-6">
                                                {formatToman(item.unitPriceToman)}
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-brand-900 sm:px-6">
                                                {formatToman(item.lineTotalToman)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between gap-4 bg-[#f8fcf9] px-5 py-5 sm:px-6">
                            <span className="text-sm font-semibold text-slate-600">جمع کل</span>
                            <span className="text-2xl font-black text-brand-900">
                                {formatToman(order.subtotalToman)}
                            </span>
                        </div>
                    </article>
                )}

                {!isLoadingOrder && order && (
                    <Link
                        to={catalogPath}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                    >
                        بازگشت به کاتالوگ
                        <ArrowRight className="size-4" />
                    </Link>
                )}
            </main>
        </div>
    );
}
