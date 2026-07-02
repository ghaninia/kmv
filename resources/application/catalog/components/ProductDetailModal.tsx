import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    ImageOff,
    Minus,
    PackageX,
    Plus,
    ShoppingCart,
    X,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { Product } from '../types/catalog';
import { formatPersianNumber, formatToman } from '../utils/currency';
import { hasProductCover } from '../utils/productImage';

type ProductDetailModalProps = {
    product: Product | null;
    onClose: () => void;
    onAddToCart?: (product: Product, quantity: number) => void;
};

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
    const [quantity, setQuantity] = useState(1);

    const images = product?.images ?? [];
    const hasGallery = images.length > 1;
    const isAvailable = product?.isAvailable !== false;
    const unavailableMessage = 'در انتظار شارژ مجدد';

    useEffect(() => {
        setActiveIndex(0);
        setFailedImages({});
        setQuantity(1);
    }, [product?.id]);

    const goPrev = useCallback(() => {
        setActiveIndex((i) => (i - 1 + images.length) % images.length);
    }, [images.length]);

    const goNext = useCallback(() => {
        setActiveIndex((i) => (i + 1) % images.length);
    }, [images.length]);

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

    useEffect(() => {
        if (!product) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, [product]);

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
                            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-50 to-emerald-50/50">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={activeIndex}
                                        className="absolute inset-0"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        {!hasProductCover(images[activeIndex]) ||
                                        failedImages[activeIndex] ? (
                                            <div className="flex h-full w-full items-center justify-center text-brand-200">
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
                                            aria-label={`تصویر ${formatPersianNumber(index + 1)}`}
                                        >
                                            {!hasProductCover(src) || failedImages[index] ? (
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

                            {product.isAvailable === false && (
                                <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                                    <PackageX className="size-3.5" />
                                    {unavailableMessage}
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

                            {isAvailable && onAddToCart && (
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="inline-flex items-center gap-1 rounded-xl border border-brand-200 bg-white p-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity((value) => Math.max(1, value - 1))
                                            }
                                            className="inline-flex size-8 items-center justify-center rounded-lg text-brand-700"
                                            aria-label="کاهش تعداد"
                                        >
                                            <Minus className="size-4" />
                                        </button>
                                        <span className="min-w-8 text-center text-sm font-semibold">
                                            {formatPersianNumber(quantity)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity((value) => Math.min(999, value + 1))
                                            }
                                            className="inline-flex size-8 items-center justify-center rounded-lg text-brand-700"
                                            aria-label="افزایش تعداد"
                                        >
                                            <Plus className="size-4" />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onAddToCart(product, quantity);
                                            onClose();
                                        }}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
                                    >
                                        <ShoppingCart className="size-4" />
                                        افزودن به سبد
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
