import { useCallback, useEffect, useMemo, useState } from 'react';
import { openProductLightbox } from '../farmix/openProductLightbox';
import { PRODUCT_PLACEHOLDER, resolveProductImage } from '../constants/productPlaceholder';
import { formatPersianNumber } from '../utils/format';

type GalleryImage = {
    id: number;
    url: string;
    order?: number;
};

type ProductImageGalleryProps = {
    images: GalleryImage[];
    fallbackUrl: string;
    alt: string;
};

export function ProductImageGallery({ images, fallbackUrl, alt }: ProductImageGalleryProps) {
    const slides = useMemo(() => {
        if (images.length > 0) {
            return images;
        }

        return [{ id: 0, url: fallbackUrl || PRODUCT_PLACEHOLDER, order: 0 }];
    }, [images, fallbackUrl]);

    const imageUrls = useMemo(() => slides.map((slide) => slide.url), [slides]);

    const [activeIndex, setActiveIndex] = useState(0);
    const hasMultiple = slides.length > 1;

    useEffect(() => {
        setActiveIndex(0);
    }, [images, fallbackUrl]);

    const goPrev = useCallback(() => {
        setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const goNext = useCallback(() => {
        setActiveIndex((index) => (index + 1) % slides.length);
    }, [slides.length]);

    const openLightbox = useCallback(
        (index: number) => {
            openProductLightbox(imageUrls, index).catch(() => undefined);
        },
        [imageUrls],
    );

    const activeSlide = slides[activeIndex] ?? slides[0];

    return (
        <div className="farmix-product-gallery">
            <div className="farmix-product-gallery-main">
                <button
                    type="button"
                    className="farmix-product-gallery-main__trigger"
                    onClick={() => openLightbox(activeIndex)}
                    aria-label="بزرگ‌نمایی تصویر در لایت‌باکس"
                >
                    <img
                        src={resolveProductImage(activeSlide.url)}
                        alt={alt}
                        onError={(event) => {
                            const target = event.currentTarget;
                            if (!target.src.includes('product-not-found.svg')) {
                                target.src = PRODUCT_PLACEHOLDER;
                            }
                        }}
                    />
                    <span className="farmix-product-gallery-zoom" aria-hidden="true">
                        <i className="far fa-search-plus" />
                        <span>بزرگ‌نمایی</span>
                    </span>
                </button>

                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            className="farmix-product-gallery-nav farmix-product-gallery-nav--prev"
                            onClick={goPrev}
                            aria-label="تصویر قبلی"
                        >
                            <i className="far fa-angle-right" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className="farmix-product-gallery-nav farmix-product-gallery-nav--next"
                            onClick={goNext}
                            aria-label="تصویر بعدی"
                        >
                            <i className="far fa-angle-left" aria-hidden="true" />
                        </button>
                        <div className="farmix-product-gallery-counter" aria-live="polite">
                            {formatPersianNumber(activeIndex + 1)} / {formatPersianNumber(slides.length)}
                        </div>
                    </>
                )}
            </div>

            {hasMultiple && (
                <div className="farmix-product-gallery-thumbs" role="tablist" aria-label="تصاویر محصول">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            type="button"
                            role="tab"
                            aria-selected={index === activeIndex}
                            className={index === activeIndex ? 'is-active' : undefined}
                            onClick={() => setActiveIndex(index)}
                            onDoubleClick={() => openLightbox(index)}
                            aria-label={`تصویر ${formatPersianNumber(index + 1)}`}
                        >
                            <img src={resolveProductImage(slide.url)} alt="" loading="lazy" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
