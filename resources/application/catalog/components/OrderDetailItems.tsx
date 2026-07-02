import type { CatalogOrderItem } from '../types/order';
import { formatPersianNumber, formatToman } from '../utils/currency';

type OrderDetailItemsProps = {
    items: CatalogOrderItem[];
};

export function OrderDetailItems({ items }: OrderDetailItemsProps) {
    return (
        <>
            <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-brand-100 bg-[#f8fcf9] text-slate-500">
                            <th className="px-5 py-3 text-right font-semibold sm:px-6">#</th>
                            <th className="px-5 py-3 text-right font-semibold sm:px-6">محصول</th>
                            <th className="px-5 py-3 text-right font-semibold sm:px-6">تعداد</th>
                            <th className="px-5 py-3 text-right font-semibold sm:px-6">قیمت واحد</th>
                            <th className="px-5 py-3 text-right font-semibold sm:px-6">جمع</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id} className="border-b border-brand-50 last:border-b-0">
                                <td className="px-5 py-3.5 text-slate-500 sm:px-6">
                                    {formatPersianNumber(index + 1)}
                                </td>
                                <td className="px-5 py-3.5 font-medium text-slate-800 sm:px-6">
                                    {item.productName}
                                </td>
                                <td className="px-5 py-3.5 sm:px-6">
                                    {formatPersianNumber(item.quantity)}
                                </td>
                                <td className="px-5 py-3.5 sm:px-6">
                                    {formatToman(item.unitPriceToman)}
                                </td>
                                <td className="px-5 py-3.5 font-semibold text-brand-900 sm:px-6">
                                    {formatToman(item.lineTotalToman)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ul className="divide-y divide-brand-50 md:hidden">
                {items.map((item, index) => (
                    <li key={item.id} className="px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-slate-400">
                                    ردیف {formatPersianNumber(index + 1)}
                                </p>
                                <p className="mt-1 font-semibold text-slate-800">{item.productName}</p>
                            </div>
                            <p className="shrink-0 font-bold text-brand-900">
                                {formatToman(item.lineTotalToman)}
                            </p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-lg bg-[#f8fcf9] px-2.5 py-1 text-slate-600">
                                تعداد: {formatPersianNumber(item.quantity)}
                            </span>
                            <span className="rounded-lg bg-[#f8fcf9] px-2.5 py-1 text-slate-600">
                                واحد: {formatToman(item.unitPriceToman)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
