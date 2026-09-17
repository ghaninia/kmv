import { Link } from 'react-router-dom';
import { PRODUCT_PLACEHOLDER, resolveProductImage } from '../constants/productPlaceholder';

type FarmixProductCardProps = {
    name: string;
    href: string;
    image: string;
    categoryLabel?: string | null;
};

export function FarmixProductCard({ name, href, image, categoryLabel }: FarmixProductCardProps) {
    return (
        <article className="product-style2 farmix-product-card farmix-product-card-unified h-100">
            <Link to={href} className="farmix-product-card-unified__media product-img" tabIndex={-1} aria-hidden="true">
                <img
                    src={resolveProductImage(image)}
                    alt={name}
                    loading="lazy"
                    onError={(event) => {
                        const target = event.currentTarget;
                        if (!target.src.includes('product-not-found.svg')) {
                            target.src = PRODUCT_PLACEHOLDER;
                        }
                    }}
                />
            </Link>
            <div className="product-about farmix-product-card-unified__body">
                <p className="text farmix-product-card-unified__category">
                    {categoryLabel ?? 'محصول'}
                </p>
                <h2 className="product-title h6">
                    <Link to={href}>{name}</Link>
                </h2>
            </div>
            <div className="social-style farmix-product-card__actions">
                <ul>
                    <li>
                        <Link to={href} className="vs-btn farmix-product-card__btn">
                            <i className="far fa-eye" aria-hidden="true" />
                            مشاهده محصول
                        </Link>
                    </li>
                </ul>
            </div>
        </article>
    );
}
