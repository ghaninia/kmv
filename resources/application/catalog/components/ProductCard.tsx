import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ImageOff, Layers, PackageCheck, PackageX } from 'lucide-react';
import { clsx } from 'clsx';
import type { Product } from '../types/catalog';
import { formatPersianNumber, formatToman } from '../utils/currency';

type ProductCardProps = {
    product: Product;
    /** Optional handler for the CTA button (e.g. open a details drawer). */
    onViewDetails?: (product: Product) => void;
};

// Shared entrance animation; the parent staggers children via a list variant.
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/**
 * Premium product card.
 *
 * Features a zoom-on-hover image, soft elevation, Toman pricing, optional SKU
 * and stock badges, a gallery indicator, and a CTA. The whole card lifts on
 * hover; the image scales within a clipped frame.
 */
export function ProductCard({ product, onViewDetails }: ProductCardProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const inStock = product.stock === undefined || product.stock > 0;
    const imageCount = product.images?.length ?? 0;

    return (
        <motion.article
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className={clsx(
                'group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white',
                'shadow-sm ring-1 ring-transparent transition-all duration-300',
                'hover:border-brand-300 hover:shadow-xl hover:shadow-brand-200/50 hover:ring-brand-100',
                'focus-within:ring-2 focus-within:ring-brand-500/40',
            )}
            aria-label={product.name}
        >
            {/* Image frame with zoom-on-hover. */}
            <button
                type="button"
                onClick={() => onViewDetails?.(product)}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-brand-50 text-start focus:outline-none"
                aria-label={`مشاهده جزئیات ${product.name}`}
            >
                {imageFailed ? (
                    <div className="flex h-full w-full items-center justify-center text-brand-200">
                        <ImageOff aria-hidden="true" className="size-10" />
                        <span className="sr-only">تصویر در دسترس نیست</span>
                    </div>
                ) : (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                )}

                {/* Subtle gradient for legibility of badges. */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {imageCount > 1 && (
                    <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-900/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                        <Layers aria-hidden="true" className="size-3.5" />
                        {formatPersianNumber(imageCount)}
                    </span>
                )}

                {product.stock !== undefined && (
                    <span
                        className={clsx(
                            'absolute start-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur',
                            inStock
                                ? 'bg-brand-50/90 text-brand-700'
                                : 'bg-rose-50/90 text-rose-700',
                        )}
                    >
                        {inStock ? (
                            <PackageCheck aria-hidden="true" className="size-3.5" />
                        ) : (
                            <PackageX aria-hidden="true" className="size-3.5" />
                        )}
                        {inStock
                            ? `${formatPersianNumber(product.stock)} عدد موجود`
                            : 'ناموجود'}
                    </span>
                )}
            </button>

            {/* Body. */}
            <div className="flex flex-1 flex-col p-5">
                <div className="flex-1">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-brand-950">
                        {product.name}
                    </h3>

                    {product.sku && (
                        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                            کد کالا: {product.sku}
                        </p>
                    )}

                    {product.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Pricing. */}
                <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3">
                    <p className="text-[0.7rem] font-medium text-brand-600">قیمت</p>
                    <p
                        dir="rtl"
                        className="mt-0.5 text-lg font-bold tracking-tight text-brand-800"
                    >
                        {formatToman(product.priceToman)}
                    </p>
                </div>

                {/* CTA. */}
                <button
                    type="button"
                    onClick={() => onViewDetails?.(product)}
                    className={clsx(
                        'mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white',
                        'transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2',
                    )}
                >
                    مشاهده جزئیات
                    <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:-translate-x-0.5"
                    />
                </button>
            </div>
        </motion.article>
    );
}
