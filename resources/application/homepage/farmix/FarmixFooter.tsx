import { Link } from 'react-router-dom';
import { contactInfo, navItems } from '../data/homeData';
import { farmixAsset } from './assets';

const contactRows = [
    {
        icon: 'far fa-phone',
        content: (
            <a href={`tel:${contactInfo.phoneTel}`}>{contactInfo.phone}</a>
        ),
    },
    {
        icon: 'far fa-envelope',
        content: (
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
        ),
    },
    {
        icon: 'fas fa-map-marker-alt',
        content: <span>{contactInfo.address}</span>,
    },
] as const;

export function FarmixFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="footer-wrapper footer-layout2 farmix-footer"
            data-bg-src={farmixAsset('img/bg/footer-bg-1-1.jpg')}
        >
            <div className="widget-area farmix-footer-widgets">
                <div className="container">
                    <div className="row g-4 g-xl-5 align-items-start farmix-footer-row">
                        <div className="col-xl-4 col-lg-6 col-12">
                            <div className="widget footer-widget farmix-footer-about">
                                <div className="vs-widget-about">
                                    <div className="footer-logo">
                                        <Link to="/">
                                            <img src={farmixAsset('img/logo-2.png')} alt="کارا ماشین وصال" />
                                        </Link>
                                    </div>
                                    <p className="footer-text">
                                        کارا ماشین وصال؛ پیشرو در تأمین تجهیزات و قطعات کشاورزی با کیفیت و
                                        استاندارد بین‌المللی.
                                    </p>
                                    <div className="footer-social farmix-footer-social">
                                        <a
                                            href={contactInfo.instagram}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="اینستاگرام"
                                        >
                                            <i className="fab fa-instagram" />
                                        </a>
                                        <a href={`mailto:${contactInfo.email}`} aria-label="ایمیل">
                                            <i className="far fa-envelope" />
                                        </a>
                                        <a href={`tel:${contactInfo.phoneTel}`} aria-label="تماس">
                                            <i className="far fa-phone" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-6 col-12">
                            <div className="widget widget_categories footer-widget farmix-footer-links">
                                <h3 className="widget_title">دسترسی سریع</h3>
                                <ul>
                                    {navItems.map((item) => (
                                        <li key={item.href}>
                                            <Link to={item.href}>{item.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-xl-5 col-lg-12 col-12">
                            <div className="widget footer-widget farmix-footer-contact">
                                <h3 className="widget_title">تماس با ما</h3>
                                <div className="footer-media farmix-footer-media">
                                    {contactRows.map((row) => (
                                        <div className="media-style1 farmix-footer-media-item" key={row.icon}>
                                            <div className="media-icon farmix-footer-media-icon" aria-hidden="true">
                                                <i className={row.icon} />
                                            </div>
                                            <div className="media-body">
                                                <p className="media-info">{row.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-wrap farmix-footer-copyright">
                <div className="container">
                    <div className="farmix-copyright-row">
                        <p className="copyright-text">
                            © {currentYear} کارا ماشین وصال — تمامی حقوق محفوظ است.
                        </p>
                        <Link to="/contact" className="farmix-copyright-link">پشتیبانی و تماس</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
