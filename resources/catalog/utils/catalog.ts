import type { Catalog, CategoryGroup, Product } from '../types/catalog';

/**
 * Pure helpers for shaping and querying catalog data on the client.
 */

/** Build a deterministic DOM id for a category section (used for scroll spy). */
export function categorySectionId(categoryId: string): string {
    return `category-section-${categoryId}`;
}

/**
 * Group a catalog's products by category, preserving the category order
 * defined by the API. Categories with no matching products are omitted, and
 * any products whose category is missing are collected under a synthetic
 * "Other" group so nothing is silently dropped.
 */
export function groupProductsByCategory(catalog: Catalog): CategoryGroup[] {
    const productsByCategory = new Map<string, Product[]>();

    for (const product of catalog.products) {
        const bucket = productsByCategory.get(product.categoryId) ?? [];
        bucket.push(product);
        productsByCategory.set(product.categoryId, bucket);
    }

    const groups: CategoryGroup[] = [];

    for (const category of catalog.categories) {
        const products = productsByCategory.get(category.id);
        if (products && products.length > 0) {
            groups.push({ category, products });
            productsByCategory.delete(category.id);
        }
    }

    // Anything left over has no known category — surface it rather than hide it.
    const orphanProducts = Array.from(productsByCategory.values()).flat();
    if (orphanProducts.length > 0) {
        groups.push({
            category: {
                id: 'uncategorized',
                name: 'Other',
                productCount: orphanProducts.length,
            },
            products: orphanProducts,
        });
    }

    return groups;
}

/**
 * Filter products by a free-text query, matching against name, SKU and
 * description. Matching is case-insensitive and ignores surrounding whitespace.
 */
export function filterProducts(products: Product[], query: string): Product[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
        return products;
    }

    return products.filter((product) => {
        const haystack = [product.name, product.sku, product.description]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return haystack.includes(normalized);
    });
}

/** Total number of products across all category groups. */
export function countProducts(groups: CategoryGroup[]): number {
    return groups.reduce((total, group) => total + group.products.length, 0);
}
