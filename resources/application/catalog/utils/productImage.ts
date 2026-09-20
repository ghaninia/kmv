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

function toSameOriginPath(imageUrl: string): string {
    const trimmed = imageUrl.trim();
    if (trimmed.startsWith('/') || trimmed.startsWith('data:')) {
        return trimmed;
    }

    try {
        const path = new URL(trimmed, window.location.origin).pathname;
        if (path) {
            return path;
        }
    } catch {
        // keep original
    }

    return trimmed;
}

export function resolveProductImage(imageUrl?: string | null): string {
    if (isPlaceholderImage(imageUrl)) {
        return PRODUCT_PLACEHOLDER;
    }

    const trimmed = imageUrl!.trim();
    if (typeof window !== 'undefined') {
        return toSameOriginPath(trimmed);
    }

    try {
        const path = new URL(trimmed).pathname;
        return path || trimmed;
    } catch {
        return trimmed;
    }
}
