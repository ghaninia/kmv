import { Link } from 'react-router-dom';
import {
    PRODUCT_PLACEHOLDER,
    isPlaceholderImage,
    resolveProductImage,
} from '../constants/productPlaceholder';

type FarmixProductCardProps = {
    name: string;
    href: string;
    image: string;
    categoryLabel?: string | null;
};

export function FarmixProductCard({ name, href, image, categoryLabel }: FarmixProductCardProps) {
    const resolvedImage = resolveProductImage(image);
    const showPlaceholderStyle = isPlaceholderImage(image);

    return (
        <article className="farmix-product-card h-100">
            <Link to={href} className="farmix-product-card__link">
                <div
                    className={`farmix-product-card__visual${
                        showPlaceholderStyle ? ' farmix-product-card__visual--placeholder' : ''
                    }`}
                >
                    <img
                        src={resolvedImage}
                        alt={name}
                        loading="lazy"
                        onError={(event) => {
                            const target = event.currentTarget;
                            if (!isPlaceholderImage(target.src)) {
                                target.src = PRODUCT_PLACEHOLDER;
                            }
                        }}
                    />
                </div>

                <div className="farmix-product-card__content">
                    <p
                        className={`farmix-product-card__category${
                            categoryLabel ? '' : ' farmix-product-card__category--empty'
                        }`}
                    >
                        {categoryLabel || '\u00a0'}
                    </p>
                    <h2 className="farmix-product-card__title">{name}</h2>
                </div>
            </Link>
        </article>
    );
}
