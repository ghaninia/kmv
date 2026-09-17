import { FarmixProductCard } from '../farmix/FarmixProductCard';
import type { PublicProduct } from '../types/storefront';

type ProductCardProps = {
    product: PublicProduct;
};

export function ProductCard({ product }: ProductCardProps) {
    return (
        <FarmixProductCard
            name={product.name}
            href={product.href}
            image={product.image}
            categoryLabel={product.category?.name}
        />
    );
}
