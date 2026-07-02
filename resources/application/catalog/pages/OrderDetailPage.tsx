import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowRight,
    CalendarDays,
    FileQuestion,
    MessageSquare,
    Phone,
    Receipt,
    User,
} from 'lucide-react';
import { CatalogPasswordGate } from '../components/CatalogPasswordGate';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { OrderDetailItems } from '../components/OrderDetailItems';
import { OrderListSkeleton } from '../components/OrderListSkeleton';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { OrdersShell } from '../components/OrdersShell';
import { useCart } from '../hooks/useCart';
import { useCatalog } from '../hooks/useCatalog';
import { fetchCatalogOrder } from '../utils/api';
import type { CatalogOrder } from '../types/order';
import { formatPersianNumber, formatToman } from '../utils/currency';
import { formatOrderDateTime } from '../utils/orderDates';
import { getStoredPassword } from '../utils/storage';

export function OrderDetailPage() {
    const { slug, orderId } = useParams<{ slug: string; orderId: string }>();
    const access = useCatalog(slug);
    const cart = useCart(slug);
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

    const dateTime = order?.createdAt ? formatOrderDateTime(order.createdAt) : null;
    const itemCount = order?.itemsCount ?? order?.items?.length ?? 0;

    return (
        <OrdersShell
            slug={slug ?? ''}
            title={order?.orderNumber ?? 'پیش‌فاکتور'}
            subtitle="جزئیات و اقلام سفارش"
            catalogTitle={access.catalog?.title}
            backTo={ordersPath}
            backLabel="بازگشت به لیست سفارش‌ها"
            cartCount={cart.totals.count}
            breadcrumb={
                order
                    ? [
                          { label: 'سفارش‌ها', to: ordersPath },
                          { label: order.orderNumber },
                      ]
                    : [{ label: 'سفارش‌ها', to: ordersPath }, { label: 'جزئیات' }]
            }
            footer={
                order ? (
                    <>
                        <Link
                            to={ordersPath}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50 sm:flex-none"
                        >
                            لیست سفارش‌ها
                        </Link>
                        <Link
                            to={catalogPath}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800 sm:flex-none"
                        >
                            کاتالوگ
                            <ArrowRight className="size-4" />
                        </Link>
                    </>
                ) : undefined
            }
        >
            {isLoadingOrder ? (
                <OrderListSkeleton />
            ) : error || !order ? (
                <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-rose-100 bg-white px-6 py-16 text-center shadow-sm">
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
                <div className="space-y-4 pb-24 sm:pb-6">
                    <article className="overflow-hidden rounded-[1.5rem] border border-brand-100 bg-white shadow-[0_8px_30px_rgba(20,83,45,0.06)]">
                        <div className="border-b border-brand-100 bg-gradient-to-l from-brand-50 via-white to-white px-4 py-5 sm:px-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <span className="grid size-14 place-items-center rounded-2xl bg-brand-700 text-white shadow-lg">
                                        <Receipt className="size-6" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-semibold text-brand-600">پیش‌فاکتور</p>
                                        <h2 className="font-mono text-2xl font-black text-brand-950">
                                            {order.orderNumber}
                                        </h2>
                                        {dateTime && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                <CalendarDays className="size-3.5" />
                                                {dateTime.date}
                                                <span className="text-slate-300">•</span>
                                                <span dir="ltr">{dateTime.time}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <OrderStatusBadge
                                    status={order.status}
                                    label={order.statusLabel}
                                    size="md"
                                />
                            </div>
                        </div>

                        <div className="grid gap-3 border-b border-brand-50 p-4 sm:grid-cols-2 sm:p-6">
                            <div className="flex items-start gap-3 rounded-2xl bg-[#f8fcf9] p-4">
                                <span className="grid size-10 place-items-center rounded-xl bg-white text-brand-700 shadow-sm">
                                    <User className="size-4" />
                                </span>
                                <div>
                                    <p className="text-xs text-slate-500">نام مشتری</p>
                                    <p className="mt-1 font-semibold text-slate-800">{order.customerName}</p>
                                </div>
                            </div>

                            {order.customerPhone ? (
                                <div className="flex items-start gap-3 rounded-2xl bg-[#f8fcf9] p-4">
                                    <span className="grid size-10 place-items-center rounded-xl bg-white text-brand-700 shadow-sm">
                                        <Phone className="size-4" />
                                    </span>
                                    <div>
                                        <p className="text-xs text-slate-500">تلفن تماس</p>
                                        <p className="mt-1 font-semibold text-slate-800" dir="ltr">
                                            {order.customerPhone}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3 rounded-2xl bg-[#f8fcf9] p-4">
                                    <span className="grid size-10 place-items-center rounded-xl bg-white text-brand-700 shadow-sm">
                                        <Receipt className="size-4" />
                                    </span>
                                    <div>
                                        <p className="text-xs text-slate-500">تعداد اقلام</p>
                                        <p className="mt-1 font-semibold text-slate-800">
                                            {formatPersianNumber(itemCount)} قلم
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {order.customerNote && (
                            <div className="border-b border-brand-50 px-4 py-4 sm:px-6">
                                <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3">
                                    <MessageSquare className="mt-0.5 size-4 shrink-0 text-amber-700" />
                                    <div>
                                        <p className="text-xs font-semibold text-amber-800">توضیحات مشتری</p>
                                        <p className="mt-1 text-sm leading-6 text-amber-900">
                                            {order.customerNote}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border-b border-brand-50 px-4 py-3 sm:px-6">
                            <h3 className="text-sm font-bold text-brand-900">اقلام سفارش</h3>
                        </div>

                        <OrderDetailItems items={order.items ?? []} />

                        <div className="flex items-center justify-between gap-4 bg-gradient-to-l from-brand-50 to-[#f8fcf9] px-4 py-5 sm:px-6">
                            <div>
                                <p className="text-sm font-semibold text-slate-600">جمع کل پیش‌فاکتور</p>
                                <p className="text-xs text-slate-400">
                                    {formatPersianNumber(itemCount)} قلم
                                </p>
                            </div>
                            <p className="text-2xl font-black text-brand-900">
                                {formatToman(order.subtotalToman)}
                            </p>
                        </div>
                    </article>
                </div>
            )}
        </OrdersShell>
    );
}
