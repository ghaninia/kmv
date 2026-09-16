import { useEffect, useState } from 'react';
import { headerSlides, navItems } from '../data/homeData';
import { ProductCarousel } from './ProductCarousel';

export function HeaderSection() {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % headerSlides.length);
        }, 5000);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className="cm-header-bg">
            <div className="cm-container">
                <div className="cm-header-top">
                    <div className="cm-header-top-main">
                        <nav className="cm-top-nav" aria-label="منوی اصلی">
                            <ul>
                                {navItems.map((item) => (
                                    <li key={item.label} className={item.active ? 'active' : undefined}>
                                        <a href={item.href}>{item.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    <div className="cm-header-logo" aria-label="کارا ماشین وصال" />
                </div>

                <div className="cm-header-hero">
                    <div className="cm-slider-wrap">
                        <div className="cm-slidedown" aria-live="polite">
                            {headerSlides.map((src, index) => (
                                <div
                                    key={src}
                                    className={`cm-slidedown-slide${index === activeSlide ? ' active' : ''}`}
                                >
                                    <img src={src} alt={`اسلاید ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cm-news-lister-body">
                        <div className="cm-news-lister">
                            <span className="cm-news-status">سایت در حال بروزرسانی است</span>
                            <span className="cm-news-dots">...</span>
                        </div>
                    </div>
                </div>
            </div>

            <ProductCarousel />
        </div>
    );
}
