import { Link } from 'react-router-dom';
import { CalendarDays, ChevronLeft, Package, Receipt, User } from 'lucide-react';
import type { CatalogOrder } from '../types/order';
import { formatPersianNumber, formatToman } from '../utils/currency';
import { formatOrderDateTime } from '../utils/orderDates';
import { OrderStatusBadge } from './OrderStatusBadge';

type PreInvoiceListCardProps = {
    order: CatalogOrder;
    to: string;
};

export function PreInvoiceListCard({ order, to }: PreInvoiceListCardProps) {
    const itemCount = order.itemsCount ?? order.items?.length ?? 0;
    const dateTime = order.createdAt ? formatOrderDateTime(order.createdAt) : null;

    return (
        <Link
            to={to}
            className="group block overflow-hidden rounded-[1.25rem] border border-brand-100/90 bg-white shadow-[0_8px_24px_rgba(20,83,45,0.05)] transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_16px_40px_rgba(20,83,45,0.1)] active:translate-y-0"
        >
            <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
                <div className="flex min-w-0 items-start gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-800 text-white shadow-md">
                        <Receipt className="size-5" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                            پیش‌فاکتور
                        </p>
                        <p className="truncate font-mono text-base font-black text-brand-950">
                            {order.orderNumber}
                        </p>
                        {dateTime && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                <CalendarDays className="size-3.5 shrink-0" />
                                <span>{dateTime.date}</span>
                                <span className="text-slate-300">•</span>
                                <span dir="ltr">{dateTime.time}</span>
                            </p>
                        )}
                    </div>
                </div>
                <OrderStatusBadge status={order.status} label={order.statusLabel} />
            </div>

            <div className="grid grid-cols-2 gap-2 px-4 pb-4 sm:px-5">
                <div className="rounded-xl bg-[#f8fcf9] px-3 py-2.5">
                    <p className="flex items-center gap-1 text-[11px] text-slate-500">
                        <User className="size-3.5" />
                        مشتری
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                        {order.customerName}
                    </p>
                </div>
                <div className="rounded-xl bg-[#f8fcf9] px-3 py-2.5">
                    <p className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Package className="size-3.5" />
                        اقلام
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                        {formatPersianNumber(itemCount)} قلم
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-brand-50 bg-gradient-to-l from-brand-50/80 to-white px-4 py-3.5 sm:px-5">
                <div>
                    <p className="text-[11px] font-medium text-slate-500">مبلغ کل</p>
                    <p className="text-xl font-black text-brand-900">{formatToman(order.subtotalToman)}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-xl bg-brand-700 px-3 py-2 text-xs font-bold text-white shadow-sm transition group-hover:bg-brand-800">
                    جزئیات
                    <ChevronLeft className="size-4 transition group-hover:-translate-x-0.5" />
                </span>
            </div>
        </Link>
    );
}
