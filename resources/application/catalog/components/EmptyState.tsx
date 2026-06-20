import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

type EmptyStateProps = {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
    /** Visual tone — `danger` is used for error/invalid states. */
    tone?: 'neutral' | 'danger';
    className?: string;
};

/**
 * A polished, reusable empty/error state used for "no products", "no search
 * results", invalid catalogs and password failures. Centers an illustrative
 * icon with a title, optional description and optional call-to-action.
 */
export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    tone = 'neutral',
    className,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={clsx(
                'flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center',
                tone === 'danger'
                    ? 'border-rose-200 bg-rose-50/60'
                    : 'border-slate-200 bg-white',
                className,
            )}
            role={tone === 'danger' ? 'alert' : 'status'}
        >
            <span
                className={clsx(
                    'mb-5 flex size-16 items-center justify-center rounded-2xl',
                    tone === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500',
                )}
            >
                <Icon aria-hidden="true" className="size-8" />
            </span>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && (
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                    {description}
                </p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </motion.div>
    );
}
