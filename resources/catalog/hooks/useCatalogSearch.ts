import { useDeferredValue, useMemo, useState } from 'react';
import type { Catalog, CategoryGroup } from '../types/catalog';
import { countProducts, filterProducts, groupProductsByCategory } from '../utils/catalog';

type UseCatalogSearchResult = {
    /** Current raw search query (controlled input value). */
    query: string;
    setQuery: (value: string) => void;
    /** Category groups after applying the active search query. */
    groups: CategoryGroup[];
    /** Number of products matching the current query. */
    resultCount: number;
    /** True when a query is active but nothing matched. */
    isEmpty: boolean;
    /** True when the user has typed a non-empty query. */
    isSearching: boolean;
};

/**
 * Client-side product search over a catalog.
 *
 * Matches against product name, SKU and description, then regroups the
 * surviving products by category so the content area and sidebar counts stay in
 * sync. `useDeferredValue` keeps typing responsive on large catalogs by letting
 * React prioritize input updates over the (potentially heavy) filtering work.
 */
export function useCatalogSearch(catalog: Catalog | null): UseCatalogSearchResult {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    const groups = useMemo<CategoryGroup[]>(() => {
        if (!catalog) {
            return [];
        }

        const allGroups = groupProductsByCategory(catalog);
        const normalized = deferredQuery.trim();

        if (!normalized) {
            return allGroups;
        }

        return allGroups
            .map((group) => ({
                category: group.category,
                products: filterProducts(group.products, normalized),
            }))
            .filter((group) => group.products.length > 0);
    }, [catalog, deferredQuery]);

    const resultCount = useMemo(() => countProducts(groups), [groups]);
    const isSearching = query.trim().length > 0;

    return {
        query,
        setQuery,
        groups,
        resultCount,
        isEmpty: isSearching && resultCount === 0,
        isSearching,
    };
}
