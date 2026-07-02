import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ClipboardList, Leaf, ShoppingCart } from 'lucide-react';
import { clsx } from 'clsx';
import { formatBadgeCount, formatPersianNumber } from '../utils/currency';

type BreadcrumbItem = {
    label: string;
    to?: string;
};

type OrdersShellProps = {
    slug: string;
    title: string;
    subtitle?: string;
    catalogTitle?: string;
    backTo: string;
    backLabel?: string;
    cartCount?: number;
    ordersCount?: number;
    breadcrumb?: BreadcrumbItem[];
    logoUrl?: string;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
};

export function OrdersShell({
    slug,
    title,
    subtitle,
    catalogTitle,
    backTo,
    backLabel = 'بازگشت',
    cartCount = 0,
    ordersCount = 0,
    breadcrumb,
    logoUrl = '/images/logo.png',
    headerAction,
    children,
    footer,
    className,
}: OrdersShellProps) {
    const location = useLocation();
    const catalogPath = `/${slug}`;
    const cartPath = `/${slug}/cart`;
    const ordersPath = `/${slug}/orders`;

    const navItems = [
        {
            key: 'catalog',
            label: 'کاتالوگ',
            to: catalogPath,
            icon: Leaf,
            isActive: location.pathname === catalogPath,
        },
        {
            key: 'cart',
            label: 'سبد خرید',
            to: cartPath,
            icon: ShoppingCart,
            isActive: location.pathname === cartPath,
            badge: cartCount,
        },
        {
            key: 'orders',
            label: 'سفارش‌ها',
            to: ordersPath,
            icon: ClipboardList,
            isActive: location.pathname.startsWith(ordersPath),
            badge: ordersCount,
        },
    ] as const;

    return (
        <div className="flex min-h-dvh flex-col bg-[#f4faf5]">
            <header
                className={clsx(
                    'sticky top-0 z-30 border-b border-brand-100/70 bg-white/95 backdrop-blur-xl',
                    'supports-[backdrop-filter]:bg-white/80',
                )}
            >
                <div className="mx-auto max-w-3xl px-4 pt-3 sm:px-6 sm:pt-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <Link
                            to={backTo}
                            className={clsx(
                                'inline-flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11',
                                'border border-brand-100 bg-white text-brand-700 shadow-sm',
                                'transition hover:border-brand-200 hover:bg-brand-50 active:scale-[0.98]',
                                'focus:outline-none focus:ring-2 focus:ring-brand-500/30',
                            )}
                            aria-label={backLabel}
                        >
                            <ArrowRight className="size-5" />
                        </Link>

                        <Link
                            to={catalogPath}
                            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl py-1 transition hover:opacity-90 sm:gap-3"
                        >
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt=""
                                    className="hidden h-9 w-auto shrink-0 object-contain sm:block"
                                />
                            ) : (
                                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-700 text-white shadow-sm">
                                    <Leaf className="size-4" />
                                </span>
                            )}
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-brand-950 sm:text-base">
                                    {catalogTitle ?? 'کاتالوگ'}
                                </p>
                                <p className="truncate text-[11px] text-slate-400 sm:text-xs">
                                    پیش‌فاکتور و سفارش
                                </p>
                            </div>
                        </Link>
                    </div>

                    <nav
                        className="mt-3 grid grid-cols-3 gap-1 rounded-2xl border border-brand-100 bg-[#f8fcf9] p-1 sm:mt-4"
                        aria-label="ناوبری کاتالوگ"
                    >
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.key}
                                    to={item.to}
                                    className={clsx(
                                        'relative inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold transition sm:gap-2 sm:px-3 sm:text-sm',
                                        'focus:outline-none focus:ring-2 focus:ring-brand-500/30',
                                        item.isActive
                                            ? 'bg-brand-700 text-white shadow-sm'
                                            : 'text-brand-800 hover:bg-white hover:text-brand-900',
                                    )}
                                    aria-current={item.isActive ? 'page' : undefined}
                                >
                                    <Icon className="size-4 shrink-0" strokeWidth={2} />
                                    <span className="truncate">{item.label}</span>
                                    {'badge' in item && item.badge != null && item.badge > 0 && (
                                        <span
                                            className={clsx(
                                                'absolute -top-1.5 -start-1 grid min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold leading-none ring-2 ring-white',
                                                item.isActive
                                                    ? 'bg-white text-brand-700'
                                                    : 'bg-brand-700 text-white',
                                            )}
                                            aria-hidden="true"
                                        >
                                            {formatBadgeCount(item.badge)}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-brand-50 py-3 sm:py-4">
                        {breadcrumb && breadcrumb.length > 0 && (
                            <ol className="mb-2 flex flex-wrap items-center gap-1 text-xs text-slate-500">
                                {breadcrumb.map((item, index) => (
                                    <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                                        {index > 0 && (
                                            <ChevronLeft
                                                className="size-3.5 text-slate-300"
                                                aria-hidden="true"
                                            />
                                        )}
                                        {item.to ? (
                                            <Link
                                                to={item.to}
                                                className="font-medium text-brand-700 transition hover:text-brand-800"
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <span className="font-medium text-slate-600">{item.label}</span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        )}

                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h1 className="truncate text-lg font-black text-brand-950 sm:text-xl">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
                                )}
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                {headerAction}
                                {ordersCount > 0 && !location.pathname.startsWith(ordersPath) && (
                                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 ring-1 ring-brand-100">
                                        {formatPersianNumber(ordersCount)} سفارش
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className={clsx('mx-auto w-full max-w-3xl flex-1 px-4 py-5 sm:px-6', className)}>
                {children}
            </main>

            {footer && (
                <footer className="sticky bottom-0 z-20 border-t border-brand-100 bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-6">
                    <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
                        {footer}
                    </div>
                </footer>
            )}
        </div>
    );
}
