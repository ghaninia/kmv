import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHomepageProducts } from '../api/products';
import type { HomepageProduct } from '../api/products';
import { HOMEPAGE_PRODUCTS_LIMIT } from '../constants/storefrontPagination';
import { farmixAsset } from './assets';
import { FarmixProductBackgroundShapes } from './FarmixProductBackgroundShapes';
import { FarmixProductCard } from './FarmixProductCard';

export function FarmixProducts() {
    const [products, setProducts] = useState<HomepageProduct[]>([]);

    useEffect(() => {
        fetchHomepageProducts(HOMEPAGE_PRODUCTS_LIMIT)
            .then(setProducts)
            .catch(() => setProducts([]));
    }, []);

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="product-layout2 space farmix-products-section">
            <div className="container">
                <div className="title-area text-center wow fadeInUp wow-animated" data-wow-delay="0.3s">
                    <div className="title-img">
                        <img src={farmixAsset('img/icon/title-logo.png')} alt="" />
                    </div>
                    <span className="sec-subtitle">محصولات</span>
                    <h2 className="sec-title">محصولات منتخب</h2>
                </div>
                <div
                    className="row vs-carousel z-index-common farmix-products-carousel"
                    data-slide-show="4"
                    data-lg-slide-show="3"
                    data-md-slide-show="2"
                    data-autoplay="true"
                    data-arrows="false"
                    data-dots="true"
                    data-center-mode="false"
                >
                    {products.map((product) => (
                        <div key={product.id} className="col-lg-3">
                            <FarmixProductCard
                                name={product.name}
                                href={product.href}
                                image={product.image}
                                categoryLabel={product.category_name}
                            />
                        </div>
                    ))}
                </div>
                <div className="text-center mt-40">
                    <Link to="/products" className="vs-btn">همه محصولات</Link>
                </div>
            </div>
            <FarmixProductBackgroundShapes />
        </section>
    );
}
