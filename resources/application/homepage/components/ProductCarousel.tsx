import { useCallback, useEffect, useMemo, useState } from 'react';
import { featuredProducts } from '../data/homeData';

const ITEM_WIDTH = 167;
const AUTO_INTERVAL_MS = 4000;
const TRANSITION_MS = 1000;
const LOOP_COPIES = 4;

export function ProductCarousel() {
    const [offset, setOffset] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const loopItems = useMemo(
        () => Array.from({ length: LOOP_COPIES }, () => featuredProducts).flat(),
        [],
    );

    const cycleLength = featuredProducts.length;

    const goNext = useCallback(() => {
        setIsAnimating(true);
        setOffset((current) => current + 1);
    }, []);

    const goPrev = useCallback(() => {
        setIsAnimating(true);
        setOffset((current) => (current <= 0 ? cycleLength - 1 : current - 1));
    }, [cycleLength]);

    useEffect(() => {
        if (isPaused) {
            return undefined;
        }

        const timer = window.setInterval(goNext, AUTO_INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [goNext, isPaused]);

    const handleTransitionEnd = () => {
        if (offset < cycleLength) {
            return;
        }

        setIsAnimating(false);
        setOffset((current) => current % cycleLength);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsAnimating(true));
        });
    };

    return (
        <div className="cm-new-shop">
            <div
                className="cm-container cm-new-shop-inner"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="cm-crsl-slider">
                    <div
                        className={`cm-crsl-track${isAnimating ? ' is-animating' : ''}`}
                        style={{ transform: `translate3d(-${offset * ITEM_WIDTH}px, 0, 0)` }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {loopItems.map((product, index) => (
                            <div key={`${product.id}-${index}`} className="cm-crsl-item">
                                <div className="cm-crsl-images">
                                    <a href={product.href}>
                                        <img src={product.image} alt={product.name} width={98} height={98} />
                                    </a>
                                </div>
                                <div className="cm-crsl-name">
                                    <span>{product.name}</span>
                                </div>
                                <div className="cm-crsl-model">
                                    <span>{product.model}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cm-arrow-new-shop">
                    <button type="button" className="prev" onClick={goPrev} aria-label="محصول قبلی" />
                    <button type="button" className="next" onClick={goNext} aria-label="محصول بعدی" />
                </div>
            </div>
        </div>
    );
}
