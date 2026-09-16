import { navItems } from '../data/homeData';
import { HeaderSlider } from './HeaderSlider';
import { ProductCarousel } from './ProductCarousel';

export function HeaderSection() {
    return (
        <div className="cm-header-bg">
            <div className="cm-container">
                <div className="cm-header-top">
                    <div className="cm-header-top-main">
                        <nav className="cm-top-nav" aria-label="منوی اصلی">
                            <ul>
                                {navItems.map((item) => (
                                    <li key={item.label} className={item.active ? 'active' : undefined}>
                                        <a href={item.href}>{item.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    <div className="cm-header-logo" aria-label="کارا ماشین وصال" />
                </div>

                <div className="cm-header-hero">
                    <HeaderSlider />

                    <div className="cm-news-lister-body">
                        <div className="cm-news-lister">
                            <span className="cm-news-status">سایت در حال بروزرسانی است</span>
                            <span className="cm-news-dots">...</span>
                        </div>
                    </div>
                </div>
            </div>

            <ProductCarousel />
        </div>
    );
}
