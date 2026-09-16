import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { headerSlides } from '../data/homeData';

const SLIDE_INTERVAL_MS = 5000;
const FADE_DURATION_S = 1;

export function HeaderSlider() {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % headerSlides.length);
        }, SLIDE_INTERVAL_MS);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className="cm-slider-wrap">
            <div className="cm-slidedown" aria-live="polite">
                {headerSlides.map((src, index) => (
                    <motion.div
                        key={src}
                        className="cm-slidedown-slide"
                        initial={false}
                        animate={{
                            opacity: index === activeSlide ? 1 : 0,
                        }}
                        transition={{
                            duration: FADE_DURATION_S,
                            ease: 'easeInOut',
                        }}
                        style={{
                            zIndex: index === activeSlide ? 1 : 0,
                        }}
                    >
                        <img src={src} alt={`اسلاید ${index + 1}`} draggable={false} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
