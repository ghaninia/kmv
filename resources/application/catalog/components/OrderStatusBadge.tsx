import { clsx } from 'clsx';

const statusClass: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    cancelled: 'bg-slate-100 text-slate-600 ring-slate-200',
};

type OrderStatusBadgeProps = {
    status: string;
    label: string;
    className?: string;
};

export function OrderStatusBadge({ status, label, className }: OrderStatusBadgeProps) {
    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                statusClass[status] ?? 'bg-slate-100 text-slate-600 ring-slate-200',
                className,
            )}
        >
            {label}
        </span>
    );
}
