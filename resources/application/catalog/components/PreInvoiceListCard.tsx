import { Link } from 'react-router-dom';
import { ChevronLeft, Receipt } from 'lucide-react';
import type { CatalogOrder } from '../types/order';
import { formatPersianNumber, formatToman } from '../utils/currency';
import { OrderStatusBadge } from './OrderStatusBadge';

type PreInvoiceListCardProps = {
    order: CatalogOrder;
    to: string;
};

export function PreInvoiceListCard({ order, to }: PreInvoiceListCardProps) {
    const itemCount = order.itemsCount ?? order.items?.length ?? 0;
    const formattedDate = order.createdAt
        ? new Date(order.createdAt).toLocaleString('fa-IR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    return (
        <Link
            to={to}
            className="group block rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-3 border-b border-brand-50 px-4 py-3">
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                        <Receipt className="size-5" />
                    </span>
                    <div>
                        <p className="text-xs font-medium text-slate-400">پیش‌فاکتور</p>
                        <p className="font-mono text-sm font-bold text-brand-950">{order.orderNumber}</p>
                    </div>
                </div>
                <OrderStatusBadge status={order.status} label={order.statusLabel} />
            </div>

            <div className="space-y-2 px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">مشتری</span>
                    <span className="font-medium text-slate-800">{order.customerName}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">تعداد اقلام</span>
                    <span className="font-medium text-slate-800">
                        {formatPersianNumber(itemCount)} قلم
                    </span>
                </div>
                {formattedDate && (
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">تاریخ</span>
                        <span className="text-xs text-slate-600">{formattedDate}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between gap-3 rounded-b-2xl bg-[#f8fcf9] px-4 py-3">
                <div>
                    <p className="text-xs text-slate-400">جمع کل</p>
                    <p className="text-lg font-black text-brand-900">{formatToman(order.subtotalToman)}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 transition group-hover:gap-2">
                    مشاهده جزئیات
                    <ChevronLeft className="size-4" />
                </span>
            </div>
        </Link>
    );
}
