import { useCallback, useEffect, useRef, useState } from 'react';
import { categorySectionId } from '../utils/catalog';

type UseActiveCategoryResult = {
    /** Id of the category section currently considered "active". */
    activeCategoryId: string | null;
    /** Smoothly scroll a category section into view and mark it active. */
    scrollToCategory: (categoryId: string) => void;
};

const SCROLL_OFFSET = 120; // Roughly the sticky header height, in pixels.

/**
 * Scroll-spy for the catalog sidebar.
 *
 * Observes each category section and reports whichever one is nearest the top
 * of the viewport as active, enabling the sidebar to highlight the user's
 * current position. Also exposes a helper to smoothly scroll to a section when a
 * sidebar link is clicked, accounting for the sticky header offset.
 *
 * @param categoryIds Ordered list of category ids currently rendered.
 */
export function useActiveCategory(categoryIds: string[]): UseActiveCategoryResult {
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
        categoryIds[0] ?? null,
    );
    // Guards against the observer fighting a user-initiated smooth scroll.
    const isProgrammaticScroll = useRef(false);
    const scrollTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (categoryIds.length === 0) {
            setActiveCategoryId(null);
            return;
        }

        // Keep a valid selection if the active id was filtered out by search.
        setActiveCategoryId((current) =>
            current && categoryIds.includes(current) ? current : categoryIds[0],
        );

        const visibility = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                if (isProgrammaticScroll.current) {
                    return;
                }

                for (const entry of entries) {
                    const id = entry.target.getAttribute('data-category-id');
                    if (id) {
                        visibility.set(id, entry.intersectionRatio);
                    }
                }

                // Pick the most-visible section, falling back to document order.
                let bestId: string | null = null;
                let bestRatio = 0;
                for (const id of categoryIds) {
                    const ratio = visibility.get(id) ?? 0;
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        bestId = id;
                    }
                }

                if (bestId) {
                    setActiveCategoryId(bestId);
                }
            },
            {
                rootMargin: `-${SCROLL_OFFSET}px 0px -55% 0px`,
                threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            },
        );

        for (const id of categoryIds) {
            const element = document.getElementById(categorySectionId(id));
            if (element) {
                observer.observe(element);
            }
        }

        return () => observer.disconnect();
    }, [categoryIds]);

    const scrollToCategory = useCallback((categoryId: string) => {
        const element = document.getElementById(categorySectionId(categoryId));
        if (!element) {
            return;
        }

        isProgrammaticScroll.current = true;
        setActiveCategoryId(categoryId);

        const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });

        if (scrollTimeout.current) {
            window.clearTimeout(scrollTimeout.current);
        }
        // Re-enable the observer once the smooth scroll has settled.
        scrollTimeout.current = window.setTimeout(() => {
            isProgrammaticScroll.current = false;
        }, 700);
    }, []);

    useEffect(() => {
        return () => {
            if (scrollTimeout.current) {
                window.clearTimeout(scrollTimeout.current);
            }
        };
    }, []);

    return { activeCategoryId, scrollToCategory };
}
