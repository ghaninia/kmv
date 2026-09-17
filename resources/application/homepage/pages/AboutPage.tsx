import { Link } from 'react-router-dom';
import { aboutContent } from '../data/homeData';
import { FarmixPageHero } from '../farmix/FarmixPageHero';
import { FarmixValuesAccordion } from '../farmix/FarmixValuesAccordion';
import { farmixAsset } from '../farmix/assets';

const ABOUT_STAT_ICONS = [
    'img/icon/counter-icon-2-1.png',
    'img/icon/counter-icon-2-2.png',
    'img/icon/counter-icon-2-3.png',
    'img/icon/counter-icon-2-4.png',
] as const;

export function AboutPage() {
    return (
        <>
            <FarmixPageHero
                title={aboutContent.title}
                subtitle="بیش از یک دهه همراه مزارع و کشاورزان سراسر کشور"
                align="center"
            />
            <section className="about-layout3 space farmix-about-section farmix-about-page farmix-storefront-page">
                <div className="container">
                    <div className="row gy-5 gx-5 align-items-center">
                        <div className="col-lg-6 order-lg-1">
                            <div className="about-content">
                                <div className="farmix-about-page-body">
                                    <p className="farmix-about-page-tagline">{aboutContent.companyStory.tagline}</p>
                                    <p className="farmix-about-page-history">{aboutContent.companyStory.history}</p>
                                    <ul className="farmix-about-page-axes">
                                        {aboutContent.companyStory.policyAxes.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <FarmixValuesAccordion
                                    id="farmix-about-page-accordion"
                                    items={aboutContent.values}
                                    defaultOpenIndex={0}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 order-lg-2">
                            <div className="about-img farmix-about-page-img">
                                <img
                                    src={farmixAsset('img/about/about-bg-2-1.jpg')}
                                    alt="کارا ماشین وصال"
                                    className="img1"
                                />
                                <div className="img-content">
                                    <h2 className="img-title h4">همراه مطمئن مزارع و کشاورزان سراسر کشور</h2>
                                    <Link to="/products" className="vs-btn">مشاهده محصولات</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="farmix-about-stats row g-4 justify-content-center">
                        {aboutContent.stats.map((stat, index) => (
                            <div key={stat.label} className="col-6 col-md-3">
                                <div className="farmix-about-stat">
                                    <img
                                        className="farmix-about-stat-icon"
                                        src={farmixAsset(ABOUT_STAT_ICONS[index] ?? ABOUT_STAT_ICONS[0])}
                                        alt=""
                                    />
                                    <p className="farmix-about-stat-value">{stat.value}</p>
                                    <p className="farmix-about-stat-label">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="farmix-faq-cta farmix-about-page-cta">
                        <p className="farmix-faq-cta-text">آماده همکاری با شما هستیم</p>
                        <div className="farmix-about-page-cta-actions">
                            <Link to="/contact" className="vs-btn style2 farmix-faq-cta-btn">
                                تماس با ما
                            </Link>
                            <Link to="/products" className="vs-btn farmix-about-page-cta-secondary">
                                محصولات
                            </Link>
                        </div>
                    </div>
                </div>
                <div
                    className="shape-mockup moving z-index-n1 d-none d-xxl-block"
                    style={{ right: '9%', bottom: '22%' }}
                >
                    <img src={farmixAsset('img/shep/about-shep-1.png')} alt="" />
                </div>
            </section>
        </>
    );
}
