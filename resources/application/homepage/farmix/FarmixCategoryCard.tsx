import { Link } from 'react-router-dom';
import {
    PRODUCT_PLACEHOLDER,
    hasProductCover,
    isPlaceholderImage,
    resolveProductImage,
} from '../../catalog/utils/productImage';
import type { PublicCategory } from '../types/storefront';
import { getCategoryIconClass } from '../utils/categoryIcon';
import { formatPersianNumber } from '../utils/format';

type FarmixCategoryCardProps = {
    category: PublicCategory;
    /** ۰–۵ برای چیدمان موزاییکی (بزرگ / کوچک / متوسط) */
    mosaicSlot?: number;
};

export function FarmixCategoryCard({ category, mosaicSlot }: FarmixCategoryCardProps) {
    const slotMod = mosaicSlot === undefined ? undefined : mosaicSlot % 6;
    const slotClass =
        slotMod === undefined ? '' : ` farmix-category-card--slot-${slotMod}`;
    const hasCover = hasProductCover(category.image);
    const imageSrc = resolveProductImage(category.image);
    const iconClass = getCategoryIconClass(category.slug, category.name);

    return (
        <article className={`farmix-category-card h-100${slotClass}`}>
            <Link to={category.href} className="farmix-category-card__link">
                <div
                    className={`farmix-category-card__visual${
                        !hasCover ? ' farmix-category-card__visual--placeholder' : ''
                    }`}
                >
                    <span className="farmix-category-card__icon-badge" aria-hidden="true">
                        <i className={iconClass} />
                    </span>
                    {hasCover ? (
                        <img
                            src={imageSrc}
                            alt=""
                            loading="lazy"
                            onError={(event) => {
                                const target = event.currentTarget;
                                if (!isPlaceholderImage(target.src)) {
                                    target.src = PRODUCT_PLACEHOLDER;
                                }
                            }}
                        />
                    ) : (
                        <span className="farmix-category-card__icon-hero" aria-hidden="true">
                            <i className={iconClass} />
                        </span>
                    )}
                </div>
                <h3 className="farmix-category-card__title">{category.name}</h3>
                <p className="farmix-category-card__meta">
                    <i className="far fa-box-open" aria-hidden="true" />
                    {formatPersianNumber(category.products_count)} محصول
                </p>
                <span className="farmix-category-card__cta">
                    مشاهده دسته
                    <i className="far fa-arrow-left" aria-hidden="true" />
                </span>
            </Link>
        </article>
    );
}
