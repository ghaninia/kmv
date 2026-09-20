import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/storefront';
import { ProductCard } from '../components/ProductCard';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { NotFoundIllustration } from '../components/NotFoundIllustration';
import { FarmixPageHero } from '../farmix/FarmixPageHero';
import { FarmixProductBackgroundShapes } from '../farmix/FarmixProductBackgroundShapes';
import { FarmixProductDetailInfo } from '../farmix/FarmixProductDetailInfo';
import type { PublicProduct } from '../types/storefront';

export function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<PublicProduct | null>(null);
    const [related, setRelated] = useState<PublicProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) {
            return;
        }

        setIsLoading(true);
        fetchProduct(slug)
            .then((data) => {
                setProduct(data.product);
                setRelated(data.related);
                setNotFound(false);
            })
            .catch(() => {
                setProduct(null);
                setRelated([]);
                setNotFound(true);
            })
            .finally(() => setIsLoading(false));
    }, [slug]);

    if (isLoading) {
        return (
            <>
                <FarmixPageHero title="جزئیات محصول" subtitle="در حال بارگذاری..." align="center" />
                <section className="product-details space farmix-product-detail farmix-storefront-page">
                    <div className="container">
                        <div className="farmix-product-detail-panel farmix-product-detail-panel--loading">
                            <div className="row g-4 g-xl-5">
                                <div className="col-lg-6">
                                    <div className="farmix-product-gallery-skeleton" />
                                </div>
                                <div className="col-lg-6">
                                    <div className="farmix-product-detail-skeleton-text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (notFound || !product) {
        return (
            <>
                <FarmixPageHero
                    title="محصول یافت نشد"
                    subtitle="این محصول در فهرست موجود نیست"
                    align="center"
                />
                <section className="product-details space farmix-product-detail farmix-storefront-page">
                    <div className="container">
                        <div className="farmix-not-found-block text-center">
                            <NotFoundIllustration />
                            <Link to="/products" className="vs-btn">بازگشت به محصولات</Link>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    const heroSubtitle = product.category
        ? product.category.name
        : product.is_available
          ? 'مشاهده جزئیات و درخواست مشاوره'
          : 'این محصول در حال حاضر نیاز به استعلام موجودی دارد';

    return (
        <>
            <FarmixPageHero title={product.name} subtitle={heroSubtitle} align="center" />
            <section className="product-details space farmix-product-detail farmix-storefront-page">
                <div className="container">
                    <div className="farmix-product-detail-toolbar">
                        <Link to="/products" className="farmix-product-detail-back">
                            <i className="far fa-arrow-right" aria-hidden="true" />
                            همه محصولات
                        </Link>
                        {product.category ? (
                            <Link
                                to={`/categories/${product.category.slug}`}
                                className="farmix-product-detail-back farmix-product-detail-back--muted"
                            >
                                {product.category.name}
                            </Link>
                        ) : null}
                    </div>

                    <div className="farmix-product-detail-layout">
                        <div className="farmix-product-detail-panel farmix-product-detail-panel--gallery">
                            <ProductImageGallery
                                images={product.images}
                                fallbackUrl={product.image}
                                alt={product.name}
                            />
                        </div>

                        <div className="farmix-product-detail-panel farmix-product-detail-panel--info">
                            <FarmixProductDetailInfo product={product} />
                        </div>
                    </div>

                    {related.length > 0 && (
                        <section className="farmix-related-products">
                            <div className="title-area text-center farmix-related-products-head">
                                <span className="sec-subtitle">محصولات مرتبط</span>
                                <h2 className="sec-title">پیشنهاد برای شما</h2>
                            </div>
                            <div className="row g-4 farmix-storefront-grid farmix-products-grid">
                                {related.map((item) => (
                                    <div key={item.id} className="col-6 col-md-6 col-lg-4 col-xl-3 d-flex">
                                        <ProductCard product={item} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <FarmixProductBackgroundShapes />
            </section>
        </>
    );
}
