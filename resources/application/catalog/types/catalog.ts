/**
 * Domain types for the public catalog storefront.
 *
 * These mirror the JSON shape returned by `GET /api/catalog/{slug}` while
 * keeping the front-end contract explicit and self-documenting.
 */

export type Catalog = {
    id: string;
    slug: string;
    title: string;
    description?: string;
    hasPassword: boolean;
    /** Toman value of a single US dollar, used for currency conversion. */
    usdToTomanRate: number;
    categories: Category[];
    products: Product[];
};

export type Category = {
    id: string;
    name: string;
    description?: string;
    productCount: number;
};

export type Product = {
    id: string;
    name: string;
    description?: string;
    imageUrl: string;
    /** Full gallery of image URLs (includes the primary image). */
    images: string[];
    sku?: string;
    stock?: number;
    priceUSD: number;
    /** Pre-computed Toman price supplied by the API. */
    priceToman: number;
    categoryId: string;
    categoryName?: string;
};

/** A category paired with the products that belong to it, ready to render. */
export type CategoryGroup = {
    category: Category;
    products: Product[];
};

/** Discriminated union describing the catalog loading lifecycle. */
export type CatalogStatus =
    | 'loading'
    | 'ready'
    | 'password-required'
    | 'not-found'
    | 'expired'
    | 'error';
