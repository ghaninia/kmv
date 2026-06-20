import { type FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

type CatalogPasswordGateProps = {
    catalogTitle?: string;
    onSubmit: (password: string) => void;
    isVerifying: boolean;
    error: string | null;
};

/**
 * Full-screen password entry gate for protected catalogs.
 *
 * Presents a centered, animated card with a single password field, a
 * show/hide toggle, inline validation error, and a loading state while the
 * password is verified against the API. Fully keyboard operable and
 * screen-reader friendly (the error is exposed via `role="alert"` and
 * `aria-describedby`).
 */
export function CatalogPasswordGate({
    catalogTitle,
    onSubmit,
    isVerifying,
    error,
}: CatalogPasswordGateProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (password.trim().length === 0 || isVerifying) {
            return;
        }
        onSubmit(password);
    }

    return (
        <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-950 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
                    <div className="flex flex-col items-center px-8 pb-2 pt-10 text-center">
                        <motion.span
                            initial={{ scale: 0.6, rotate: -8 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                            className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30"
                            aria-hidden="true"
                        >
                            <Lock className="size-7" />
                        </motion.span>
                        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                            کاتالوگ محافظت‌شده
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            {catalogTitle ? (
                                <>
                                    <span className="font-medium text-slate-700">
                                        {catalogTitle}
                                    </span>{' '}
                                    با رمز عبور محافظت شده است. برای ادامه رمز عبور را وارد کنید.
                                </>
                            ) : (
                                'این کاتالوگ با رمز عبور محافظت شده است. برای ادامه رمز عبور را وارد کنید.'
                            )}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-8 pb-10 pt-6" noValidate>
                        <label
                            htmlFor="catalog-password"
                            className="block text-sm font-medium text-slate-700"
                        >
                            رمز عبور
                        </label>
                        <div className="relative mt-2">
                            <input
                                id="catalog-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoFocus
                                autoComplete="current-password"
                                aria-invalid={Boolean(error)}
                                aria-describedby={error ? 'catalog-password-error' : undefined}
                                className={clsx(
                                    'w-full rounded-xl border bg-white px-4 py-3 pe-12 text-sm text-slate-900 shadow-sm transition',
                                    'placeholder:text-slate-400 focus:outline-none focus:ring-2',
                                    error
                                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/30'
                                        : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/30',
                                )}
                                placeholder="رمز عبور کاتالوگ را وارد کنید"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((shown) => !shown)}
                                aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
                                className="absolute end-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-brand-50 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                            >
                                {showPassword ? (
                                    <EyeOff aria-hidden="true" className="size-4" />
                                ) : (
                                    <Eye aria-hidden="true" className="size-4" />
                                )}
                            </button>
                        </div>

                        {error && (
                            <motion.p
                                id="catalog-password-error"
                                role="alert"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-rose-600"
                            >
                                <ShieldAlert aria-hidden="true" className="size-4" />
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={isVerifying || password.trim().length === 0}
                            className={clsx(
                                'mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition',
                                'hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2',
                                'disabled:cursor-not-allowed disabled:opacity-60',
                            )}
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                                    در حال بررسی…
                                </>
                            ) : (
                                'باز کردن کاتالوگ'
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
