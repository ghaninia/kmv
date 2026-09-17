import { Link } from 'react-router-dom';
import { hasProductCover } from '../../catalog/utils/productImage';
import { PRODUCT_PLACEHOLDER } from '../constants/productPlaceholder';
import type { PublicCategory } from '../types/storefront';
import { formatPersianNumber } from '../utils/format';

function categoryImageSrc(category: PublicCategory): string {
    return hasProductCover(category.image) ? category.image : PRODUCT_PLACEHOLDER;
}

type FarmixCategoryCardProps = {
    category: PublicCategory;
    /** ۰–۵ برای چیدمان موزاییکی (بزرگ / کوچک / متوسط) */
    mosaicSlot?: number;
};

export function FarmixCategoryCard({ category, mosaicSlot }: FarmixCategoryCardProps) {
    const slotMod = mosaicSlot === undefined ? undefined : mosaicSlot % 6;
    const slotClass =
        slotMod === undefined ? '' : ` farmix-category-card--slot-${slotMod}`;
    const imageSrc = categoryImageSrc(category);
    const isPlaceholder = !hasProductCover(category.image);

    return (
        <div className={`categorie-style2 farmix-category-card${slotClass}`}>
            <div
                className={`categorie-img${isPlaceholder ? ' categorie-img--placeholder' : ''}`}
            >
                <img src={imageSrc} alt={category.name} loading="lazy" />
            </div>
            <div className="categorie-content">
                <h3 className="categorie-title h5">
                    <Link to={category.href}>{category.name}</Link>
                </h3>
                <p className="categorie-text">
                    {formatPersianNumber(category.products_count)} محصول
                </p>
            </div>
        </div>
    );
}
