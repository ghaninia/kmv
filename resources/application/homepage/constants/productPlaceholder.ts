export const PRODUCT_PLACEHOLDER = '/images/product-not-found.svg';

export function resolveProductImage(imageUrl?: string | null): string {
    return imageUrl?.trim() ? imageUrl : PRODUCT_PLACEHOLDER;
}
