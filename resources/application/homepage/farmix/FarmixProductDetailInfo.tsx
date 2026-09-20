import { Link } from 'react-router-dom';
import { contactInfo } from '../data/homeData';
import type { PublicProduct } from '../types/storefront';
import { formatPersianNumber } from '../utils/format';

function productDescription(text: string | null | undefined): string | null {
    const normalized = text?.trim();
    return normalized || null;
}

type FarmixProductDetailInfoProps = {
    product: PublicProduct;
};

export function FarmixProductDetailInfo({ product }: FarmixProductDetailInfoProps) {
    const description = productDescription(product.description);
    const galleryCount = product.images?.length ?? 0;
    const contactParams = new URLSearchParams({
        product: product.name,
        subject: `درخواست خرید: ${product.name}`,
    });
    const contactHref = `/contact?${contactParams.toString()}`;

    return (
        <div className="farmix-product-detail-info">
            <div className="farmix-product-detail-meta">
                {product.category ? (
                    <Link
                        to={`/categories/${product.category.slug}`}
                        className="farmix-product-detail-badge farmix-product-detail-badge--category"
                    >
                        <i className="far fa-folder-open" aria-hidden="true" />
                        {product.category.name}
                    </Link>
                ) : null}
                <span
                    className={`farmix-product-detail-badge farmix-product-detail-badge--${
                        product.is_available ? 'available' : 'unavailable'
                    }`}
                >
                    <i
                        className={`far ${product.is_available ? 'fa-check-circle' : 'fa-clock'}`}
                        aria-hidden="true"
                    />
                    {product.is_available ? 'موجود' : 'ناموجود — استعلام از فروش'}
                </span>
                {galleryCount > 0 ? (
                    <span className="farmix-product-detail-badge farmix-product-detail-badge--muted">
                        <i className="far fa-images" aria-hidden="true" />
                        {formatPersianNumber(galleryCount)} تصویر
                    </span>
                ) : null}
            </div>

            <h1 className="farmix-product-detail-name">{product.name}</h1>

            <dl className="farmix-product-detail-specs">
                <div className="farmix-product-detail-spec">
                    <dt>کد محصول</dt>
                    <dd>{product.slug}</dd>
                </div>
                {product.category ? (
                    <div className="farmix-product-detail-spec">
                        <dt>دسته‌بندی</dt>
                        <dd>
                            <Link to={`/categories/${product.category.slug}`}>
                                {product.category.name}
                            </Link>
                        </dd>
                    </div>
                ) : null}
                <div className="farmix-product-detail-spec">
                    <dt>وضعیت</dt>
                    <dd>{product.is_available ? 'آماده تأمین' : 'نیاز به هماهنگی موجودی'}</dd>
                </div>
            </dl>

            <section className="farmix-product-detail-description-card" aria-labelledby="product-description-title">
                <h2 id="product-description-title" className="farmix-product-detail-description-title">
                    توضیحات محصول
                </h2>
                {description ? (
                    <div className="farmix-product-detail-description-body">{description}</div>
                ) : (
                    <p className="farmix-product-detail-description-empty">
                        برای این محصول هنوز توضیحی ثبت نشده است. تیم فروش می‌تواند مشخصات فنی و قیمت را
                        به شما اعلام کند.
                    </p>
                )}
            </section>

            <aside className="farmix-product-detail-contact-card">
                <h3 className="farmix-product-detail-contact-title">مشاوره و سفارش</h3>
                <p className="farmix-product-detail-contact-lead">
                    برای قیمت، موجودی و ارسال با واحد فروش تماس بگیرید.
                </p>
                <ul className="farmix-product-detail-contact-list">
                    <li>
                        <a href={`tel:${contactInfo.phoneTel}`}>
                            <i className="far fa-phone-alt" aria-hidden="true" />
                            {contactInfo.phone}
                        </a>
                    </li>
                    <li>
                        <a href={`mailto:${contactInfo.email}`}>
                            <i className="far fa-envelope" aria-hidden="true" />
                            {contactInfo.email}
                        </a>
                    </li>
                </ul>
            </aside>

            <div className="farmix-product-detail-actions">
                <Link to={contactHref} className="vs-btn">
                    <i className="far fa-envelope" aria-hidden="true" />
                    درخواست خرید / مشاوره
                </Link>
                <a href={`tel:${contactInfo.phoneTel}`} className="vs-btn style2 farmix-product-detail-secondary">
                    <i className="far fa-phone-alt" aria-hidden="true" />
                    تماس تلفنی
                </a>
            </div>
        </div>
    );
}
