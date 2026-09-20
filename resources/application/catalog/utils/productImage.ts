export const PRODUCT_PLACEHOLDER = '/images/not-found.png';

export function isPlaceholderImage(imageUrl?: string | null): boolean {
    if (!imageUrl?.trim()) {
        return true;
    }

    const normalized = imageUrl.trim().toLowerCase();

    return (
        normalized.includes('product-not-found') || normalized.includes('not-found.png')
    );
}

export function hasProductCover(imageUrl?: string | null): boolean {
    return !isPlaceholderImage(imageUrl);
}

export function resolveProductImage(imageUrl?: string | null): string {
    if (isPlaceholderImage(imageUrl)) {
        return PRODUCT_PLACEHOLDER;
    }

    return imageUrl!.trim();
}
