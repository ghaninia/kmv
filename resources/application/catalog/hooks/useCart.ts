import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Product } from '../types/catalog';

export type CartLine = {
    productId: string;
    quantity: number;
    name: string;
    priceToman: number;
    priceUSD: number;
    imageUrl: string;
};

const STORAGE_PREFIX = 'catalog_cart_';

function storageKey(slug: string): string {
    return `${STORAGE_PREFIX}${slug}`;
}

function readCart(slug: string): CartLine[] {
    try {
        const raw = window.localStorage.getItem(storageKey(slug));
        if (!raw) return [];
        const parsed = JSON.parse(raw) as CartLine[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeCart(slug: string, items: CartLine[]): void {
    try {
        window.localStorage.setItem(storageKey(slug), JSON.stringify(items));
    } catch {
        /* Ignore storage failures. */
    }
}

export function useCart(slug: string | undefined) {
    const [items, setItems] = useState<CartLine[]>([]);

    useEffect(() => {
        if (!slug) {
            setItems([]);
            return;
        }
        setItems(readCart(slug));
    }, [slug]);

    const persist = useCallback(
        (updater: CartLine[] | ((current: CartLine[]) => CartLine[])) => {
            if (!slug) return;
            setItems((current) => {
                const next = typeof updater === 'function' ? updater(current) : updater;
                writeCart(slug, next);
                return next;
            });
        },
        [slug],
    );

    const addItem = useCallback(
        (product: Product, quantity = 1) => {
            if (product.isAvailable === false) return;

            persist((current) => {
                const existing = current.find((line) => line.productId === product.id);
                if (existing) {
                    return current.map((line) =>
                        line.productId === product.id
                            ? { ...line, quantity: Math.min(line.quantity + quantity, 999) }
                            : line,
                    );
                }

                return [
                    ...current,
                    {
                        productId: product.id,
                        quantity: Math.max(1, quantity),
                        name: product.name,
                        priceToman: product.priceToman,
                        priceUSD: product.priceUSD,
                        imageUrl: product.imageUrl,
                    },
                ];
            });
        },
        [persist],
    );

    const setQuantity = useCallback(
        (productId: string, quantity: number) => {
            if (quantity <= 0) {
                persist((current) => current.filter((line) => line.productId !== productId));
                return;
            }

            persist((current) =>
                current.map((line) =>
                    line.productId === productId
                        ? { ...line, quantity: Math.min(quantity, 999) }
                        : line,
                ),
            );
        },
        [persist],
    );

    const removeItem = useCallback(
        (productId: string) => {
            persist((current) => current.filter((line) => line.productId !== productId));
        },
        [persist],
    );

    const clearCart = useCallback(() => {
        persist([]);
    }, [persist]);

    const totals = useMemo(() => {
        return items.reduce(
            (acc, line) => {
                acc.count += line.quantity;
                acc.toman += line.priceToman * line.quantity;
                acc.usd += line.priceUSD * line.quantity;
                return acc;
            },
            { count: 0, toman: 0, usd: 0 },
        );
    }, [items]);

    return {
        items,
        addItem,
        setQuantity,
        removeItem,
        clearCart,
        totals,
        isEmpty: items.length === 0,
    };
}
