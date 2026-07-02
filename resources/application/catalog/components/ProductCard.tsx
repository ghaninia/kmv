import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpLeft,
    Check,
    Eye,
    ImageOff,
    Layers,
    PackageX,
    Plus,
    ShoppingBag,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { Product } from '../types/catalog';
import { formatPersianNumber, formatToman } from '../utils/currency';

type ProductCardProps = {
    product: Product;
    onViewDetails?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    cartQuantity?: number;
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export function ProductCard({
    product,
    onViewDetails,
    onAddToCart,
    cartQuantity = 0,
}: ProductCardProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const imageCount = product.images?.length ?? 0;
    const isAvailable = product.isAvailable !== false;
    const unavailableMessage = 'در انتظار شارژ مجدد';
    const inCart = cartQuantity > 0;

    function handleAddToCart() {
        if (!isAvailable || !onAddToCart) return;
        onAddToCart(product);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1200);
    }

    return (
        <motion.article
            variants={cardVariants}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className={clsx(
                'group relative flex h-full flex-col overflow-hidden rounded-[1.75rem]',
                'border border-brand-100/80 bg-white shadow-[0_8px_30px_rgba(20,83,45,0.06)]',
                'ring-1 ring-transparent transition-all duration-500',
                'hover:border-brand-200 hover:shadow-[0_20px_50px_rgba(20,83,45,0.12)] hover:ring-brand-100',
                !isAvailable && 'opacity-95',
            )}
            aria-label={product.name}
        >
            <div className="relative overflow-hidden">
                <button
                    type="button"
                    onClick={() => onViewDetails?.(product)}
                    className="relative block aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-brand-50 to-emerald-50/50 text-start focus:outline-none"
                    aria-label={`مشاهده جزئیات ${product.name}`}
                >
                    {imageFailed ? (
                        <div className="flex h-full w-full items-center justify-center text-brand-200">
                            <ImageOff aria-hidden="true" className="size-12" />
                        </div>
                    ) : (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            loading="lazy"
                            onError={() => setImageFailed(true)}
                            className={clsx(
                                'h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110',
                                !isAvailable && 'scale-105 grayscale-[0.35]',
                            )}
                        />
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/55 via-brand-950/10 to-transparent" />

                    {!isAvailable && (
                        <div className="absolute inset-0 flex items-end justify-center bg-brand-950/20 p-4 backdrop-blur-[1px]">
                            <span className="inline-flex max-w-full items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 text-xs font-semibold text-rose-700 shadow-lg">
                                <PackageX className="size-4 shrink-0" />
                                <span className="leading-snug">{unavailableMessage}</span>
                            </span>
                        </div>
                    )}

                    {product.categoryName && (
                        <span className="absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-brand-800 shadow-sm backdrop-blur">
                            {product.categoryName}
                        </span>
                    )}

                    {imageCount > 1 && (
                        <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-950/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                            <Layers className="size-3.5" />
                            {formatPersianNumber(imageCount)}
                        </span>
                    )}

                    {inCart && (
                        <span className="absolute end-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-harvest px-3 py-1 text-[11px] font-bold text-white shadow-md">
                            <Check className="size-3.5" />
                            {formatPersianNumber(cartQuantity)} در سبد
                        </span>
                    )}
                </button>

                {isAvailable && onAddToCart && (
                    <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className={clsx(
                                'flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-xl transition',
                                justAdded
                                    ? 'bg-emerald-500'
                                    : 'bg-brand-700 hover:bg-brand-800',
                            )}
                        >
                            {justAdded ? (
                                <>
                                    <Check className="size-4" />
                                    به سبد اضافه شد
                                </>
                            ) : (
                                <>
                                    <Plus className="size-4" />
                                    افزودن سریع به سبد
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex-1">
                    <button
                        type="button"
                        onClick={() => onViewDetails?.(product)}
                        className="text-start focus:outline-none"
                    >
                        <h3 className="line-clamp-2 text-base font-bold leading-snug text-brand-950 transition group-hover:text-brand-800">
                            {product.name}
                        </h3>
                    </button>

                    {product.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                            {product.description}
                        </p>
                    )}
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-lime-50/80">
                    <div className="flex items-stretch">
                        <div className="flex flex-1 flex-col justify-center px-4 py-3.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                                قیمت واحد
                            </span>
                            <p dir="rtl" className="mt-1 text-lg font-black tracking-tight text-brand-900">
                                {formatToman(product.priceToman)}
                            </p>
                        </div>

                        <div className="flex w-[1px] bg-brand-100" aria-hidden="true" />

                        <div className="flex min-w-[7.5rem] flex-col">
                            {isAvailable && onAddToCart ? (
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className={clsx(
                                        'flex flex-1 flex-col items-center justify-center gap-1 px-3 py-3 text-xs font-bold transition',
                                        justAdded
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-brand-700 text-white hover:bg-brand-800',
                                    )}
                                >
                                    <ShoppingBag className="size-4" />
                                    {inCart ? 'افزودن' : 'سبد'}
                                </button>
                            ) : (
                                <div className="flex flex-1 items-center justify-center px-3 py-3 text-xs font-semibold text-slate-400">
                                    ناموجود
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => onViewDetails?.(product)}
                                className="flex items-center justify-center gap-1 border-t border-brand-100 bg-white/80 px-3 py-2.5 text-[11px] font-semibold text-brand-700 transition hover:bg-brand-50"
                            >
                                <Eye className="size-3.5" />
                                جزئیات
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onViewDetails?.(product)}
                    className="mt-3 inline-flex items-center gap-1 self-start text-xs font-semibold text-brand-700 opacity-0 transition-all duration-300 group-hover:opacity-100"
                >
                    مشاهده کامل محصول
                    <ArrowUpLeft className="size-3.5" />
                </button>
            </div>
        </motion.article>
    );
}
