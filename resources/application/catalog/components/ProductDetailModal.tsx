import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    ImageOff,
    PackageCheck,
    PackageX,
    X,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { Product } from '../types/catalog';
import { formatPersianNumber, formatToman } from '../utils/currency';

type ProductDetailModalProps = {
    product: Product | null;
    onClose: () => void;
};

/**
 * Product detail modal with an image gallery slider.
 *
 * Shows the full product information (name, SKU, stock, description, Toman
 * price) alongside a swipeable/clickable image carousel with thumbnail strip.
 * Closes on backdrop click or the Escape key. Toman-only pricing — the USD
 * value is intentionally hidden from the public storefront.
 */
export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

    const images = product?.images ?? [];
    const hasGallery = images.length > 1;

    // Reset the carousel whenever a new product is opened.
    useEffect(() => {
        setActiveIndex(0);
        setFailedImages({});
    }, [product?.id]);

    const goPrev = useCallback(() => {
        setActiveIndex((i) => (i - 1 + images.length) % images.length);
    }, [images.length]);

    const goNext = useCallback(() => {
        setActiveIndex((i) => (i + 1) % images.length);
    }, [images.length]);

    // Keyboard: Escape to close, arrows to navigate (RTL-aware).
    useEffect(() => {
        if (!product) return;

        function onKey(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose();
            if (!hasGallery) return;
            if (event.key === 'ArrowRight') goPrev();
            if (event.key === 'ArrowLeft') goNext();
        }

        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [product, hasGallery, goPrev, goNext, onClose]);

    // Lock body scroll while the modal is open.
    useEffect(() => {
        if (!product) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, [product]);

    const inStock = product
        ? product.stock === undefined || product.stock > 0
        : false;

    return (
        <AnimatePresence>
            {product && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={product.name}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative z-10 flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl lg:flex-row"
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute end-3 top-3 z-20 inline-flex size-9 items-center justify-center rounded-full bg-white/80 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                            aria-label="بستن"
                        >
                            <X className="size-5" />
                        </button>

                        {/* Gallery */}
                        <div className="flex w-full shrink-0 flex-col bg-brand-50/50 lg:w-1/2">
                            <div className="relative aspect-square overflow-hidden bg-brand-50">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={activeIndex}
                                        className="absolute inset-0"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        {failedImages[activeIndex] ? (
                                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                <ImageOff
                                                    aria-hidden="true"
                                                    className="size-12"
                                                />
                                                <span className="sr-only">
                                                    تصویر در دسترس نیست
                                                </span>
                                            </div>
                                        ) : (
                                            <img
                                                src={images[activeIndex]}
                                                alt={`${product.name} — تصویر ${formatPersianNumber(
                                                    activeIndex + 1,
                                                )}`}
                                                className="h-full w-full object-cover"
                                                onError={() =>
                                                    setFailedImages((prev) => ({
                                                        ...prev,
                                                        [activeIndex]: true,
                                                    }))
                                                }
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {hasGallery && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={goNext}
                                            className="absolute start-3 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                            aria-label="تصویر بعدی"
                                        >
                                            <ChevronRight className="size-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={goPrev}
                                            className="absolute end-3 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                            aria-label="تصویر قبلی"
                                        >
                                            <ChevronLeft className="size-5" />
                                        </button>

                                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                                            {images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setActiveIndex(index)}
                                                    className={clsx(
                                                        'h-2 rounded-full transition-all',
                                                        index === activeIndex
                                                            ? 'w-5 bg-white'
                                                            : 'w-2 bg-white/60 hover:bg-white/80',
                                                    )}
                                                    aria-label={`رفتن به تصویر ${formatPersianNumber(
                                                        index + 1,
                                                    )}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail strip */}
                            {hasGallery && (
                                <div className="flex gap-2 overflow-x-auto p-3">
                                    {images.map((src, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setActiveIndex(index)}
                                            className={clsx(
                                                'relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition',
                                                index === activeIndex
                                                    ? 'border-brand-500'
                                                    : 'border-transparent opacity-70 hover:opacity-100',
                                            )}
                                            aria-label={`تصویر ${formatPersianNumber(
                                                index + 1,
                                            )}`}
                                        >
                                            {failedImages[index] ? (
                                                <span className="flex h-full w-full items-center justify-center bg-brand-50 text-brand-200">
                                                    <ImageOff className="size-5" />
                                                </span>
                                            ) : (
                                                <img
                                                    src={src}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    onError={() =>
                                                        setFailedImages((prev) => ({
                                                            ...prev,
                                                            [index]: true,
                                                        }))
                                                    }
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex w-full flex-col overflow-y-auto p-6 lg:w-1/2">
                            {product.categoryName && (
                                <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100">
                                    {product.categoryName}
                                </span>
                            )}

                            <h2 className="mt-3 text-xl font-bold leading-snug text-brand-950">
                                {product.name}
                            </h2>

                            {product.sku && (
                                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    کد کالا: {product.sku}
                                </p>
                            )}

                            {product.stock !== undefined && (
                                <span
                                    className={clsx(
                                        'mt-3 inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                                        inStock
                                            ? 'bg-brand-50 text-brand-700'
                                            : 'bg-rose-50 text-rose-700',
                                    )}
                                >
                                    {inStock ? (
                                        <PackageCheck className="size-3.5" />
                                    ) : (
                                        <PackageX className="size-3.5" />
                                    )}
                                    {inStock
                                        ? `${formatPersianNumber(product.stock)} عدد موجود`
                                        : 'ناموجود'}
                                </span>
                            )}

                            {product.description ? (
                                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                                    {product.description}
                                </p>
                            ) : (
                                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                                    توضیحاتی برای این محصول ثبت نشده است.
                                </p>
                            )}

                            <div className="mt-auto rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-4">
                                <p className="text-xs font-medium text-brand-600">قیمت</p>
                                <p
                                    dir="rtl"
                                    className="mt-1 text-2xl font-bold tracking-tight text-brand-800"
                                >
                                    {formatToman(product.priceToman)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
