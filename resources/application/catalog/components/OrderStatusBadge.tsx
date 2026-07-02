import { clsx } from 'clsx';

const statusStyles: Record<string, { badge: string; dot: string }> = {
    pending: {
        badge: 'bg-amber-50 text-amber-800 ring-amber-200/80',
        dot: 'bg-amber-500',
    },
    confirmed: {
        badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200/80',
        dot: 'bg-emerald-500',
    },
    cancelled: {
        badge: 'bg-slate-100 text-slate-600 ring-slate-200',
        dot: 'bg-slate-400',
    },
};

type OrderStatusBadgeProps = {
    status: string;
    label: string;
    className?: string;
    size?: 'sm' | 'md';
};

export function OrderStatusBadge({
    status,
    label,
    className,
    size = 'sm',
}: OrderStatusBadgeProps) {
    const styles = statusStyles[status] ?? statusStyles.cancelled;

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset',
                size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs',
                styles.badge,
                className,
            )}
        >
            <span className={clsx('size-1.5 shrink-0 rounded-full', styles.dot)} aria-hidden="true" />
            {label}
        </span>
    );
}
