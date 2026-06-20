import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ImageOff, PackageCheck, PackageX } from 'lucide-react';
import { clsx } from 'clsx';
import type { Product } from '../types/catalog';
import { formatPersianNumber, formatToman, formatUsd } from '../utils/currency';

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
 * Features a zoom-on-hover image, soft elevation, dual-currency pricing
 * (Toman primary, USD secondary), optional SKU and stock badges, and a CTA. The
 * whole card lifts on hover; the image scales within a clipped frame.
 */
export function ProductCard({ product, onViewDetails }: ProductCardProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const inStock = product.stock === undefined || product.stock > 0;

    return (
        <motion.article
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className={clsx(
                'group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white',
                'shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/70',
                'focus-within:ring-2 focus-within:ring-indigo-500/40',
            )}
            aria-label={product.name}
        >
            {/* Image frame with zoom-on-hover. */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                {imageFailed ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <ImageOff aria-hidden="true" className="size-10" />
                        <span className="sr-only">Image unavailable</span>
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

                {product.stock !== undefined && (
                    <span
                        className={clsx(
                            'absolute start-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur',
                            inStock
                                ? 'bg-emerald-50/90 text-emerald-700'
                                : 'bg-rose-50/90 text-rose-700',
                        )}
                    >
                        {inStock ? (
                            <PackageCheck aria-hidden="true" className="size-3.5" />
                        ) : (
                            <PackageX aria-hidden="true" className="size-3.5" />
                        )}
                        {inStock
                            ? `${formatPersianNumber(product.stock)} in stock`
                            : 'Out of stock'}
                    </span>
                )}
            </div>

            {/* Body. */}
            <div className="flex flex-1 flex-col p-5">
                <div className="flex-1">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900">
                        {product.name}
                    </h3>

                    {product.sku && (
                        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                            SKU: {product.sku}
                        </p>
                    )}

                    {product.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Pricing. */}
                <div className="mt-4">
                    <p
                        dir="rtl"
                        className="text-lg font-bold tracking-tight text-slate-900"
                    >
                        {formatToman(product.priceToman)}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-400">
                        {formatUsd(product.priceUSD)}
                    </p>
                </div>

                {/* CTA. */}
                <button
                    type="button"
                    onClick={() => onViewDetails?.(product)}
                    className={clsx(
                        'mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white',
                        'transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2',
                    )}
                >
                    View Details
                    <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                </button>
            </div>
        </motion.article>
    );
}
