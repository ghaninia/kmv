export const PRODUCT_PLACEHOLDER = '/images/product-not-found.svg';

export function hasProductCover(imageUrl?: string | null): boolean {
    if (!imageUrl?.trim()) {
        return false;
    }

    return !imageUrl.includes('/product-not-found.');
}
