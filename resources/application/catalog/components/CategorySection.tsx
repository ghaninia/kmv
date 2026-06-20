import { motion } from 'framer-motion';
import type { CategoryGroup, Product } from '../types/catalog';
import { categorySectionId } from '../utils/catalog';
import { formatPersianNumber } from '../utils/currency';
import { ProductCard } from './ProductCard';

type CategorySectionProps = {
    group: CategoryGroup;
    onViewProduct?: (product: Product) => void;
};

// Stagger the cards within a section so they cascade in as it reveals.
const gridVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.06 },
    },
};

/**
 * A single category block: heading, optional description, product count and a
 * responsive product grid (4 columns desktop / 2 tablet / 1 mobile).
 *
 * The section animates into view as it scrolls into the viewport, and registers
 * the `data-category-id`/`id` attributes consumed by the scroll-spy hook.
 */
export function CategorySection({ group, onViewProduct }: CategorySectionProps) {
    const { category, products } = group;
    const headingId = `${categorySectionId(category.id)}-heading`;

    return (
        <section
            id={categorySectionId(category.id)}
            data-category-id={category.id}
            aria-labelledby={headingId}
            className="scroll-mt-28"
        >
            <header className="mb-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2
                        id={headingId}
                        className="text-2xl font-bold tracking-tight text-slate-900"
                    >
                        {category.name}
                    </h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-500">
                        {formatPersianNumber(products.length)} محصول
                    </span>
                </div>
                {category.description && (
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
                        {category.description}
                    </p>
                )}
            </header>

            <motion.div
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={onViewProduct}
                    />
                ))}
            </motion.div>
        </section>
    );
}
