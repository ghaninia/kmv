export type HomepageProduct = {
    id: number;
    name: string;
    category_name: string | null;
    slug: string;
    image: string;
    href: string;
};

type HomepageProductsResponse = {
    success: boolean;
    data: HomepageProduct[];
};

export async function fetchHomepageProducts(limit = 12): Promise<HomepageProduct[]> {
    const response = await fetch(`/api/homepage/products?limit=${limit}`);

    if (!response.ok) {
        throw new Error('Failed to load homepage products');
    }

    const json: HomepageProductsResponse = await response.json();

    return json.data ?? [];
}
