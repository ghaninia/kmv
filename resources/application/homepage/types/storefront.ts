export type PublicCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    products_count: number;
    image: string;
    href: string;
};

export type PublicProduct = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    image: string;
    images: Array<{ id: number; url: string; order: number }>;
    is_available: boolean;
    href: string;
};

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};
