import { PUBLIC_PRODUCTS_PER_PAGE } from '../constants/storefrontPagination';
import type { PaginationMeta, PublicCategory, PublicProduct } from '../types/storefront';

type ApiListResponse<T> = {
    success: boolean;
    data: T;
    meta?: PaginationMeta;
};

type ProductDetailResponse = {
    success: boolean;
    data: {
        product: PublicProduct;
        related: PublicProduct[];
    };
};

type CategoryDetailResponse = {
    success: boolean;
    data: {
        category: PublicCategory;
        products: PublicProduct[];
    };
    meta?: PaginationMeta;
};

async function parseJson<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

export async function fetchCategories(): Promise<PublicCategory[]> {
    const response = await fetch('/api/public/categories');
    const json = await parseJson<ApiListResponse<PublicCategory[]>>(response);

    return json.data ?? [];
}

export async function fetchCategory(
    slug: string,
    params: { page?: number; search?: string } = {},
): Promise<CategoryDetailResponse['data'] & { meta?: PaginationMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.search) query.set('search', params.search);
    query.set('per_page', String(PUBLIC_PRODUCTS_PER_PAGE));

    const response = await fetch(`/api/public/categories/${slug}?${query.toString()}`);
    const json = await parseJson<CategoryDetailResponse>(response);

    return { ...json.data, meta: json.meta };
}

export async function fetchProducts(
    params: { page?: number; search?: string; category?: string } = {},
): Promise<{ products: PublicProduct[]; meta?: PaginationMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    query.set('per_page', String(PUBLIC_PRODUCTS_PER_PAGE));

    const response = await fetch(`/api/public/products?${query.toString()}`);
    const json = await parseJson<ApiListResponse<PublicProduct[]>>(response);

    return { products: json.data ?? [], meta: json.meta };
}

export async function fetchProduct(slug: string): Promise<ProductDetailResponse['data']> {
    const response = await fetch(`/api/public/products/${slug}`);
    const json = await parseJson<ProductDetailResponse>(response);

    return json.data;
}

export type ContactPayload = {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
};

export async function submitContact(payload: ContactPayload): Promise<string> {
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        },
        body: JSON.stringify(payload),
    });

    const json = await parseJson<{ success: boolean; message: string }>(response);

    return json.message;
}
