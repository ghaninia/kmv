import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { heroSlides } from '../data/homeData';
import { farmixAsset } from './assets';

const SLIDE_INTERVAL_MS = 7000;

export function FarmixHero() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [motionOn, setMotionOn] = useState(true);
    const [progressKey, setProgressKey] = useState(0);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const bumpMotion = useCallback(() => {
        setMotionOn(false);
        setProgressKey((key) => key + 1);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setMotionOn(true));
        });
    }, []);

    const goToSlide = useCallback(
        (index: number) => {
            if (index === activeIndex) {
                bumpMotion();
                return;
            }
            setActiveIndex(index);
            bumpMotion();
        },
        [activeIndex, bumpMotion],
    );

    useEffect(() => {
        if (paused) {
            return undefined;
        }

        intervalRef.current = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % heroSlides.length);
            bumpMotion();
        }, SLIDE_INTERVAL_MS);

        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, [paused, bumpMotion, activeIndex]);

    return (
        <div
            className={`hero-layout3 farmix-hero${paused ? ' farmix-hero-paused' : ''}`}
            data-bg-src={farmixAsset('img/bg/hero-bg-3.jpg')}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setPaused(false);
                }
            }}
        >
            <div className="farmix-hero-grain" aria-hidden="true" />
            <div className="container position-relative">
                <div className="row align-items-center farmix-hero-row">
                    <div className="col-lg-6 farmix-hero-text-col order-lg-1">
                        <div className="hero-slide farmix-hero-slide-wrap">
                            {heroSlides.map((slide, index) => {
                                const isActive = index === activeIndex;

                                return (
                                    <div
                                        key={slide.title}
                                        className={[
                                            'hero-content',
                                            'farmix-hero-slide',
                                            isActive ? 'is-active' : '',
                                            isActive && motionOn ? 'farmix-hero-motion' : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        aria-hidden={!isActive}
                                    >
                                        <h1 className="hero-title farmix-hero-reveal farmix-hero-reveal--title">
                                            {slide.title}
                                        </h1>
                                        <p className="hero-text farmix-hero-reveal farmix-hero-reveal--text">
                                            {slide.text}
                                        </p>
                                        <ul className="farmix-hero-highlights">
                                            {slide.highlights.map((item, highlightIndex) => (
                                                <li
                                                    key={item}
                                                    className="farmix-hero-reveal farmix-hero-reveal--li"
                                                    style={
                                                        {
                                                            '--farmix-stagger': highlightIndex,
                                                        } as CSSProperties
                                                    }
                                                >
                                                    <i className="fas fa-check-circle" aria-hidden="true" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="hero-bottom farmix-hero-actions farmix-hero-reveal farmix-hero-reveal--actions">
                                            <Link to={slide.primaryCta.href} className="vs-btn farmix-hero-cta-primary">
                                                {slide.primaryCta.label}
                                            </Link>
                                            <Link
                                                to={slide.secondaryCta.href}
                                                className="vs-btn style2 farmix-hero-cta-secondary"
                                            >
                                                {slide.secondaryCta.label}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="farmix-hero-dots" role="tablist" aria-label="اسلایدها">
                                {heroSlides.map((slide, index) => (
                                    <button
                                        key={slide.title}
                                        type="button"
                                        role="tab"
                                        className={index === activeIndex ? 'is-active' : ''}
                                        aria-selected={index === activeIndex}
                                        aria-label={`اسلاید ${index + 1}: ${slide.title}`}
                                        onClick={() => goToSlide(index)}
                                    >
                                        {index === activeIndex ? (
                                            <span
                                                key={progressKey}
                                                className="farmix-hero-dot-progress"
                                                style={{ animationDuration: `${SLIDE_INTERVAL_MS}ms` }}
                                            />
                                        ) : null}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 farmix-hero-image-col order-lg-2">
                        <div className="farmix-hero-accent" aria-hidden="true" />
                        <div className="hero-images farmix-hero-images">
                            <div className="image-item">
                                {heroSlides.map((slide, index) => {
                                    const isActive = index === activeIndex;

                                    return (
                                        <div
                                            key={slide.title}
                                            className={[
                                                'slide-img',
                                                'farmix-hero-slide',
                                                isActive ? 'is-active' : '',
                                                isActive && motionOn ? 'farmix-hero-motion' : '',
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                            aria-hidden={!isActive}
                                        >
                                            <div className="farmix-hero-img-shape">
                                                <img src={farmixAsset(slide.image)} alt={slide.title} />
                                            </div>
                                            <div className="slide-icon farmix-hero-badge">
                                                <img src={farmixAsset('img/hero/hero-batch.png')} alt="" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
