import { useCallback, useState } from 'react';
import { ABOUT_VIDEO_SLIDES } from '../constants/aboutVideo';
import { FarmixAboutVideo } from './FarmixAboutVideo';

type FarmixAboutVideoSliderProps = {
    className?: string;
};

export function FarmixAboutVideoSlider({ className = '' }: FarmixAboutVideoSliderProps) {
    const slides = ABOUT_VIDEO_SLIDES;
    const [index, setIndex] = useState(0);
    const total = slides.length;
    const current = slides[index] ?? slides[0];

    const goTo = useCallback(
        (next: number) => {
            if (total <= 1) {
                return;
            }
            setIndex(((next % total) + total) % total);
        },
        [total],
    );

    const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
    const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

    if (!current) {
        return null;
    }

    const rootClass = ['farmix-about-video-slider', className].filter(Boolean).join(' ');

    return (
        <div className={rootClass} aria-roledescription="carousel" aria-label="ویدیوهای معرفی محصولات">
            <div className="farmix-about-video-slider__stage">
                <FarmixAboutVideo
                    key={current.id}
                    src={current.src}
                    poster={current.poster}
                    label={current.label}
                />

                {total > 1 && (
                    <>
                        <button
                            type="button"
                            className="farmix-about-video-slider__nav farmix-about-video-slider__nav--prev"
                            onClick={goPrev}
                            aria-label="ویدیوی قبلی"
                        >
                            <i className="fas fa-chevron-left" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className="farmix-about-video-slider__nav farmix-about-video-slider__nav--next"
                            onClick={goNext}
                            aria-label="ویدیوی بعدی"
                        >
                            <i className="fas fa-chevron-right" aria-hidden="true" />
                        </button>
                    </>
                )}
            </div>

            {total > 1 && (
                <div className="farmix-about-video-slider__dots" role="tablist" aria-label="انتخاب ویدیو">
                    {slides.map((slide, slideIndex) => {
                        const active = slideIndex === index;
                        return (
                            <button
                                key={slide.id}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                aria-label={slide.label}
                                className={`farmix-about-video-slider__dot${active ? ' is-active' : ''}`}
                                onClick={() => goTo(slideIndex)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
