import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle2,
    Phone,
    Receipt,
    ShoppingBag,
    Trash2,
    User,
} from 'lucide-react';
import { clsx } from 'clsx';
import { CatalogPasswordGate } from '../components/CatalogPasswordGate';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { useCart } from '../hooks/useCart';
import { useCatalog } from '../hooks/useCatalog';
import { CartLineRow } from '../components/CartLineRow';
import { submitCatalogOrder } from '../utils/api';
import { formatPersianNumber, formatToman } from '../utils/currency';
import { getStoredPassword } from '../utils/storage';

export function CartPage() {
    const { slug } = useParams<{ slug: string }>();
    const access = useCatalog(slug);
    const cart = useCart(slug);

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerNote, setCustomerNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<{ orderNumber: string } | null>(null);

    const catalogPath = slug ? `/${slug}` : '/';

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!slug) return;

        setError(null);
        setIsSubmitting(true);

        try {
            const result = await submitCatalogOrder(slug, {
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim() || undefined,
                customerNote: customerNote.trim() || undefined,
                password: getStoredPassword(slug) ?? undefined,
                items: cart.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            });

            setSuccess({ orderNumber: result.orderNumber });
            cart.clearCart();
        } catch (submitError) {
            setError(
                submitError instanceof Error ? submitError.message : 'ثبت سفارش ناموفق بود.',
            );
        } finally {
            setIsSubmitting(false);
        }
    }

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
                description="برای مشاهده سبد خرید، ابتدا باید رمز عبور این کاتالوگ را وارد کنید."
                submitLabel="ورود و مشاهده سبد خرید"
                backTo={catalogPath}
            />
        );
    }

    if (access.status === 'not-found' || access.status === 'expired' || access.status === 'error') {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-[#f8fcf9] px-4 py-12">
                <div className="w-full max-w-lg">
                    <EmptyState
                        title={
                            access.status === 'not-found'
                                ? 'کاتالوگ پیدا نشد'
                                : access.status === 'expired'
                                  ? 'این لینک منقضی شده است'
                                  : 'مشکلی پیش آمد'
                        }
                        description="در حال حاضر امکان دسترسی به سبد خرید وجود ندارد."
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

    if (success) {
        return (
            <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f8fcf9] px-4 py-12">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-700 text-white shadow-lg">
                        <CheckCircle2 className="size-10" />
                    </div>
                    <h1 className="mt-6 text-2xl font-black text-brand-950">پیش‌فاکتور ثبت شد</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        شماره پیش‌فاکتور:{' '}
                        <span className="font-mono font-bold text-brand-800">
                            {success.orderNumber}
                        </span>
                    </p>
                    <Link
                        to={slug ? `/${slug}/orders` : catalogPath}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
                    >
                        مشاهده سفارش‌های من
                    </Link>
                    <Link
                        to={catalogPath}
                        className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-800"
                    >
                        بازگشت به کاتالوگ
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-dvh flex-col bg-[#f8fcf9]">
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
                        <h1 className="text-lg font-black text-brand-950">سبد خرید شما</h1>
                        <p className="text-xs text-slate-400">
                            {formatPersianNumber(cart.items.length)} قلم ·{' '}
                            {formatPersianNumber(cart.totals.count)} عدد
                        </p>
                    </div>
                    {cart.items.length > 0 && (
                        <button
                            type="button"
                            onClick={cart.clearCart}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                        >
                            <Trash2 className="size-3.5" />
                            پاک کردن
                        </button>
                    )}
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
                {cart.isEmpty ? (
                    <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                        <div className="flex size-20 items-center justify-center rounded-full bg-brand-50 text-brand-400">
                            <ShoppingBag className="size-9" />
                        </div>
                        <h2 className="mt-5 text-lg font-bold text-brand-950">سبد خرید خالی است</h2>
                        <p className="mt-2 max-w-xs text-sm text-slate-500">
                            محصولات موجود را از کاتالوگ انتخاب کنید.
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
                    <>
                        <section className="rounded-2xl border border-brand-100 bg-white px-4 shadow-sm sm:px-5">
                            <div className="hidden border-b border-brand-50 py-3 text-xs font-semibold text-slate-400 sm:grid sm:grid-cols-[minmax(0,1fr)_12rem_7rem_2.5rem] sm:gap-4">
                                <span>محصول</span>
                                <span className="text-center">تعداد</span>
                                <span className="text-end">جمع</span>
                                <span />
                            </div>
                            <ul>
                                {cart.items.map((item) => (
                                    <CartLineRow
                                        key={item.productId}
                                        item={item}
                                        onSetQuantity={cart.setQuantity}
                                        onRemoveItem={cart.removeItem}
                                    />
                                ))}
                            </ul>
                        </section>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5 pb-8">
                            <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">جمع کل</span>
                                    <span dir="rtl" className="text-xl font-black text-brand-900">
                                        {formatToman(cart.totals.toman)}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
                                <h2 className="text-sm font-bold text-brand-950">اطلاعات تماس</h2>
                                <div className="mt-4 space-y-3">
                                    <label className="relative block">
                                        <User className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-brand-500" />
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="نام و نام خانوادگی *"
                                            required
                                            className="w-full rounded-xl border border-brand-200 py-2.5 pe-3 ps-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                        />
                                    </label>
                                    <label className="relative block">
                                        <Phone className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-brand-500" />
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="شماره تماس"
                                            className="w-full rounded-xl border border-brand-200 py-2.5 pe-3 ps-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                        />
                                    </label>
                                    <textarea
                                        value={customerNote}
                                        onChange={(e) => setCustomerNote(e.target.value)}
                                        placeholder="توضیحات (اختیاری)"
                                        rows={2}
                                        className="w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={clsx(
                                    'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition',
                                    isSubmitting
                                        ? 'cursor-not-allowed bg-brand-400'
                                        : 'bg-brand-700 hover:bg-brand-800',
                                )}
                            >
                                <Receipt className="size-4" />
                                {isSubmitting ? 'در حال ثبت...' : 'ثبت نهایی پیش‌فاکتور'}
                            </button>
                        </form>
                    </>
                )}
            </main>
        </div>
    );
}
