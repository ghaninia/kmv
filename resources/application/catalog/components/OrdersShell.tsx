import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { clsx } from 'clsx';

type OrdersShellProps = {
    title: string;
    subtitle?: string;
    backTo: string;
    backLabel?: string;
    catalogTitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
};

export function OrdersShell({
    title,
    subtitle,
    backTo,
    backLabel = 'بازگشت',
    catalogTitle,
    children,
    footer,
    className,
}: OrdersShellProps) {
    return (
        <div className="flex min-h-dvh flex-col bg-[#f4faf5]">
            <header
                className={clsx(
                    'sticky top-0 z-20 border-b border-brand-100/80 bg-white/95 backdrop-blur-xl',
                    'supports-[backdrop-filter]:bg-white/80',
                )}
            >
                <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
                    <div className="flex items-start gap-3">
                        <Link
                            to={backTo}
                            className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-white text-brand-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 active:scale-[0.98]"
                            aria-label={backLabel}
                        >
                            <ArrowRight className="size-5" />
                        </Link>

                        <div className="min-w-0 flex-1 pt-0.5">
                            {catalogTitle && (
                                <p className="truncate text-xs font-medium text-brand-600">
                                    {catalogTitle}
                                </p>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="grid size-8 place-items-center rounded-xl bg-brand-700 text-white shadow-sm">
                                    <ClipboardList className="size-4" />
                                </span>
                                <div className="min-w-0">
                                    <h1 className="truncate text-lg font-black text-brand-950 sm:text-xl">
                                        {title}
                                    </h1>
                                    {subtitle && (
                                        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className={clsx('mx-auto w-full max-w-3xl flex-1 px-4 py-5 sm:px-6', className)}>
                {children}
            </main>

            {footer && (
                <footer className="sticky bottom-0 border-t border-brand-100 bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-6">
                    <div className="mx-auto flex max-w-3xl items-center justify-center gap-3">
                        {footer}
                    </div>
                </footer>
            )}
        </div>
    );
}
