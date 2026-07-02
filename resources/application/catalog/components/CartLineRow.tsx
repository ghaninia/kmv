import { useState } from 'react';
import { ImageOff, Minus, Plus, Trash2 } from 'lucide-react';
import type { CartLine } from '../hooks/useCart';
import { formatPersianNumber, formatToman } from '../utils/currency';
import { hasProductCover } from '../utils/productImage';

type CartLineRowProps = {
    item: CartLine;
    onSetQuantity: (productId: string, quantity: number) => void;
    onRemoveItem: (productId: string) => void;
};

export function CartLineRow({ item, onSetQuantity, onRemoveItem }: CartLineRowProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const lineTotal = item.priceToman * item.quantity;
    const showCover = hasProductCover(item.imageUrl) && !imageFailed;

    return (
        <li className="flex flex-col gap-3 border-b border-brand-100 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 to-emerald-50/50 ring-1 ring-brand-100">
                    {showCover ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="size-full object-cover"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center text-brand-200">
                            <ImageOff className="size-6" />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-bold leading-snug text-brand-950">
                        {item.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        {formatToman(item.priceToman)}
                        <span className="text-slate-400"> / واحد</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-white p-1">
                    <button
                        type="button"
                        onClick={() => onSetQuantity(item.productId, item.quantity - 1)}
                        className="inline-flex size-8 items-center justify-center rounded-full text-brand-700 transition hover:bg-brand-50"
                        aria-label="کاهش تعداد"
                    >
                        <Minus className="size-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-bold text-brand-900">
                        {formatPersianNumber(item.quantity)}
                    </span>
                    <button
                        type="button"
                        onClick={() => onSetQuantity(item.productId, item.quantity + 1)}
                        className="inline-flex size-8 items-center justify-center rounded-full bg-brand-700 text-white transition hover:bg-brand-800"
                        aria-label="افزایش تعداد"
                    >
                        <Plus className="size-4" />
                    </button>
                </div>

                <p dir="rtl" className="min-w-[7rem] text-end text-sm font-black text-brand-900">
                    {formatToman(lineTotal)}
                </p>

                <button
                    type="button"
                    onClick={() => onRemoveItem(item.productId)}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label="حذف"
                >
                    <Trash2 className="size-4" />
                </button>
            </div>
        </li>
    );
}
