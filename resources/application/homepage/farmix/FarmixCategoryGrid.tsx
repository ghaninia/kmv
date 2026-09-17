import type { PublicCategory } from '../types/storefront';
import { FarmixCategoryCard } from './FarmixCategoryCard';

const HOMEPAGE_CATEGORY_LIMIT = 6;

type FarmixHomepageCategoryGridProps = {
    categories: PublicCategory[];
};

/** صفحه اصلی: حداکثر ۶ دسته با چیدمان ثابت (یک بزرگ + کوچک‌ها + متوسط‌ها). */
export function FarmixHomepageCategoryGrid({ categories }: FarmixHomepageCategoryGridProps) {
    const items = categories.slice(0, HOMEPAGE_CATEGORY_LIMIT);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="farmix-categories-mosaic farmix-categories-mosaic--featured">
            {items.map((category, index) => (
                <FarmixCategoryCard key={category.id} category={category} mosaicSlot={index} />
            ))}
        </div>
    );
}

type FarmixCategoryGridProps = {
    categories: PublicCategory[];
};

/** صفحه /categories — همان الگوی اندازه‌ها به‌صورت تکرارشونده. */
export function FarmixCategoryGrid({ categories }: FarmixCategoryGridProps) {
    return (
        <div className="farmix-categories-mosaic farmix-categories-mosaic--flow farmix-categories-grid">
            {categories.map((category, index) => (
                <FarmixCategoryCard key={category.id} category={category} mosaicSlot={index} />
            ))}
        </div>
    );
}
