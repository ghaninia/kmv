import axios, { AxiosError } from 'axios';
import type { Catalog, Category, Product } from '../types/catalog';

/**
 * Thin API client for the public catalog endpoint.
 *
 * Responsibilities:
 *  - Talk to `GET /api/catalog/{slug}` (optionally with a password).
 *  - Translate the snake_case JSON payload into the camelCase domain model.
 *  - Normalize backend error states into a small, typed error union so the UI
 *    can render the appropriate empty/error/password experience.
 */

const client = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// Attach the CSRF token issued by Laravel, mirroring the admin SPA bootstrap.
const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
if (csrfToken) {
    client.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
}

export type CatalogErrorKind =
    | 'password-required'
    | 'invalid-password'
    | 'not-found'
    | 'expired'
    | 'network';

/** Error thrown by {@link fetchCatalog} carrying a UI-friendly discriminator. */
export class CatalogError extends Error {
    constructor(
        public readonly kind: CatalogErrorKind,
        message: string,
    ) {
        super(message);
        this.name = 'CatalogError';
    }
}

type RawProduct = {
    id: number | string;
    name: string;
    description?: string | null;
    image?: string | null;
    images?: (string | null)[] | null;
    sku?: string | null;
    stock?: number | null;
    is_available?: boolean | null;
    price_usd: number;
    price_toman: number;
    category_id?: number | string | null;
    category_name?: string | null;
};

type RawCategory = {
    id: number | string;
    name: string;
    description?: string | null;
    product_count: number;
};

type RawCatalog = {
    id: number | string;
    slug: string;
    name: string;
    description?: string | null;
    has_password?: boolean;
    usd_to_toman_rate: number;
    categories?: RawCategory[];
    products?: RawProduct[];
};

const FALLBACK_IMAGE = '/storage/placeholders/product.jpg';

function mapProduct(raw: RawProduct): Product {
    const gallery = (raw.images ?? [])
        .filter((url): url is string => Boolean(url));
    const primary = raw.image ?? gallery[0] ?? FALLBACK_IMAGE;
    const images = gallery.length > 0 ? gallery : [primary];

    return {
        id: String(raw.id),
        name: raw.name,
        description: raw.description ?? undefined,
        imageUrl: primary,
        images,
        sku: raw.sku ?? undefined,
        stock: raw.stock ?? undefined,
        isAvailable: raw.is_available ?? true,
        priceUSD: raw.price_usd,
        priceToman: raw.price_toman,
        categoryId: raw.category_id != null ? String(raw.category_id) : 'uncategorized',
        categoryName: raw.category_name ?? undefined,
    };
}

function mapCategory(raw: RawCategory): Category {
    return {
        id: String(raw.id),
        name: raw.name,
        description: raw.description ?? undefined,
        productCount: raw.product_count,
    };
}

function mapCatalog(raw: RawCatalog): Catalog {
    return {
        id: String(raw.id),
        slug: raw.slug,
        title: raw.name,
        description: raw.description ?? undefined,
        hasPassword: Boolean(raw.has_password),
        usdToTomanRate: raw.usd_to_toman_rate,
        categories: (raw.categories ?? []).map(mapCategory),
        products: (raw.products ?? []).map(mapProduct),
    };
}

export async function fetchCatalog(slug: string, password?: string): Promise<Catalog> {
    try {
        const response = await client.get<{ success: boolean; data: RawCatalog }>(
            `/catalog/${encodeURIComponent(slug)}`,
            { params: password ? { password } : undefined },
        );

        return mapCatalog(response.data.data);
    } catch (error) {
        throw normalizeError(error, Boolean(password));
    }
}

function normalizeError(error: unknown, passwordAttempted: boolean): CatalogError {
    if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response;
        const payload = data as { requires_password?: boolean; message?: string } | undefined;

        if (status === 403 && payload?.requires_password) {
            return new CatalogError('password-required', 'This catalog is password protected.');
        }

        if (status === 403) {
            // A 403 without `requires_password` after a password attempt means
            // the supplied password was wrong.
            return new CatalogError(
                passwordAttempted ? 'invalid-password' : 'password-required',
                payload?.message ?? 'Invalid password.',
            );
        }

        if (status === 404) {
            return new CatalogError('not-found', payload?.message ?? 'Catalog not found.');
        }

        if (status === 410) {
            return new CatalogError('expired', payload?.message ?? 'This link has expired.');
        }
    }

    return new CatalogError('network', 'Something went wrong while loading the catalog.');
}

export type SubmitOrderPayload = {
    customerName: string;
    customerPhone?: string;
    customerNote?: string;
    password?: string;
    items: Array<{ productId: string; quantity: number }>;
};

export type SubmittedOrder = {
    orderNumber: string;
    customerName: string;
    subtotalToman: number;
};

type RawOrder = {
    order_number: string;
    customer_name: string;
    subtotal_toman: number;
};

export async function submitCatalogOrder(
    slug: string,
    payload: SubmitOrderPayload,
): Promise<SubmittedOrder> {
    try {
        const response = await client.post<{ success: boolean; data: RawOrder }>(
            `/catalog/${encodeURIComponent(slug)}/orders`,
            {
                customer_name: payload.customerName,
                customer_phone: payload.customerPhone || null,
                customer_note: payload.customerNote || null,
                password: payload.password || null,
                items: payload.items.map((item) => ({
                    product_id: Number(item.productId),
                    quantity: item.quantity,
                })),
            },
        );

        return {
            orderNumber: response.data.data.order_number,
            customerName: response.data.data.customer_name,
            subtotalToman: response.data.data.subtotal_toman,
        };
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 422) {
            const payload = error.response.data as { message?: string; errors?: Record<string, string[]> };
            const firstError = payload.errors
                ? Object.values(payload.errors)[0]?.[0]
                : undefined;
            throw new Error(firstError || payload.message || 'ثبت سفارش ناموفق بود.');
        }

        if (error instanceof AxiosError && error.response?.status === 403) {
            throw new Error('دسترسی به کاتالوگ مجاز نیست. رمز را بررسی کنید.');
        }

        throw new Error('ثبت سفارش ناموفق بود. دوباره تلاش کنید.');
    }
}
