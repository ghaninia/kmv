export const PRODUCT_PLACEHOLDER = '/storage/placeholders/product.jpg';

export function hasProductCover(imageUrl?: string | null): boolean {
    if (!imageUrl?.trim()) {
        return false;
    }

    return !imageUrl.includes('/placeholders/');
}
