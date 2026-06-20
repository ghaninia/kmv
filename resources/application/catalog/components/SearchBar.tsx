import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    /** Live result count, announced to assistive tech while typing. */
    resultCount?: number;
    placeholder?: string;
    className?: string;
};

/**
 * Accessible, controlled search input with a clear button.
 *
 * Acts as a labelled search landmark and announces result counts via an
 * `aria-live` region so screen-reader users hear how many products match as
 * they type.
 */
export function SearchBar({
    value,
    onChange,
    resultCount,
    placeholder = 'جستجوی محصول، کد کالا، توضیحات…',
    className,
}: SearchBarProps) {
    const hasValue = value.length > 0;

    return (
        <div className={clsx('relative', className)} role="search">
            <label htmlFor="catalog-search" className="sr-only">
                جستجوی محصولات
            </label>
            <Search
                aria-hidden="true"
                className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400"
            />
            <input
                id="catalog-search"
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                autoComplete="off"
                className={clsx(
                    'w-full rounded-xl border border-slate-200 bg-white py-2.5 ps-11 pe-11 text-sm text-slate-900 shadow-sm',
                    'placeholder:text-slate-400',
                    'transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30',
                )}
            />
            {hasValue && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    aria-label="پاک کردن جستجو"
                    className={clsx(
                        'absolute end-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400',
                        'transition hover:bg-brand-50 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40',
                    )}
                >
                    <X aria-hidden="true" className="size-4" />
                </button>
            )}
            <span aria-live="polite" className="sr-only">
                {hasValue && resultCount !== undefined
                    ? `${resultCount} نتیجه یافت شد`
                    : ''}
            </span>
        </div>
    );
}
