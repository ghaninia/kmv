import { productCategories } from '../data/homeData';

export function ProductsSection() {
    return (
        <section className="cm-products">
            <div className="cm-container">
                <div className="cm-products-grid">
                    <div className="cm-products-intro">
                        <h2 className="cm-products-title">محصولات</h2>
                        <p className="cm-products-subtitle">
                            همانطور که مشاهده می کنید , هدف همه کارکنان ما برای خدمت به مشتریان در کارآمد
                            ترین راه، با بالاترین کیفیت
                        </p>
                    </div>

                    <div className="cm-products-list-wrap">
                        <div className="cm-products-body">
                            <ul>
                                {productCategories.map((category) => (
                                    <li key={category.label} className={category.className}>
                                        <a href={category.href}>
                                            <span>{category.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
