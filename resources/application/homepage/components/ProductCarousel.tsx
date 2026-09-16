import { useCallback, useEffect, useRef, useState } from 'react';
import { featuredProducts } from '../data/homeData';

const ITEM_WIDTH = 167;
const AUTO_MS = 4000;
const SPEED_MS = 1000;
const VISIBLE_COUNT = 5;

const loopProducts = [...featuredProducts, ...featuredProducts, ...featuredProducts];
const START_INDEX = featuredProducts.length;

export function ProductCarousel() {
    const [index, setIndex] = useState(START_INDEX);
    const [animate, setAnimate] = useState(true);
    const trackRef = useRef<HTMLDivElement>(null);

    const goTo = useCallback((nextIndex: number, withAnimation = true) => {
        setAnimate(withAnimation);
        setIndex(nextIndex);
    }, []);

    const goPrev = useCallback(() => {
        goTo(index - 1);
    }, [goTo, index]);

    const goNext = useCallback(() => {
        goTo(index + 1);
    }, [goTo, index]);

    useEffect(() => {
        const timer = window.setInterval(goNext, AUTO_MS);
        return () => window.clearInterval(timer);
    }, [goNext]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) {
            return;
        }

        const handleTransitionEnd = (event: TransitionEvent) => {
            if (event.propertyName !== 'transform') {
                return;
            }

            if (index >= featuredProducts.length * 2) {
                goTo(index - featuredProducts.length, false);
                return;
            }

            if (index < featuredProducts.length) {
                goTo(index + featuredProducts.length, false);
            }
        };

        track.addEventListener('transitionend', handleTransitionEnd);
        return () => track.removeEventListener('transitionend', handleTransitionEnd);
    }, [goTo, index]);

    return (
        <div className="cm-new-shop">
            <div className="cm-container cm-new-shop-inner">
                <div className="cm-crsl-slider">
                    <div
                        ref={trackRef}
                        className={`cm-crsl-track${animate ? ' cm-crsl-track--animate' : ''}`}
                        style={{ transform: `translate3d(${index * ITEM_WIDTH}px, 0, 0)` }}
                    >
                        {loopProducts.map((product, productIndex) => (
                            <div key={`${product.id}-${productIndex}`} className="cm-crsl-item">
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
