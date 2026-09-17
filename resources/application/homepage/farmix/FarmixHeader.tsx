import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { contactInfo, navItems } from '../data/homeData';
import { farmixAsset } from './assets';
import { HamburgerIcon } from './HamburgerIcon';

const STICKY_SCROLL_THRESHOLD = 120;

export function FarmixHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [headerStuck, setHeaderStuck] = useState(false);
    const stickyWrapperRef = useRef<HTMLDivElement>(null);
    const stickyBarRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menuOpen]);

    useEffect(() => {
        const syncSticky = () => {
            const stuck = window.scrollY > STICKY_SCROLL_THRESHOLD;
            setHeaderStuck(stuck);

            const wrapper = stickyWrapperRef.current;
            const bar = stickyBarRef.current;
            if (wrapper && bar) {
                wrapper.style.minHeight = stuck ? `${bar.offsetHeight}px` : '';
            }
        };

        syncSticky();
        window.addEventListener('scroll', syncSticky, { passive: true });
        window.addEventListener('resize', syncSticky);

        return () => {
            window.removeEventListener('scroll', syncSticky);
            window.removeEventListener('resize', syncSticky);
        };
    }, [location.pathname]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <div
                className={`farmix-menu-drawer${menuOpen ? ' farmix-menu-open' : ''}`}
                aria-hidden={!menuOpen}
            >
                <button
                    type="button"
                    className="farmix-menu-backdrop"
                    onClick={closeMenu}
                    aria-label="بستن منو"
                    tabIndex={menuOpen ? 0 : -1}
                />
                <div
                    className="farmix-menu-area"
                    role="dialog"
                    aria-modal="true"
                    aria-hidden={!menuOpen}
                >
                    <button
                        type="button"
                        className="farmix-menu-close"
                        onClick={closeMenu}
                        aria-label="بستن منو"
                    >
                        <i className="fal fa-times" />
                    </button>
                    <div className="mobile-logo">
                        <Link to="/" onClick={closeMenu}>
                            <img src={farmixAsset('img/logo.png')} alt="کارا ماشین وصال" />
                        </Link>
                    </div>
                    <nav className="vs-mobile-menu farmix-drawer-nav" aria-label="منوی اصلی">
                        <ul>
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <Link to={item.href} onClick={closeMenu}>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            <header className="vs-header header-layout3 farmix-header-compact">
                <div className="header-top farmix-header-top d-none d-lg-block">
                    <div className="container">
                        <div className="farmix-header-top-inner">
                            <div className="farmix-top-contact-group">
                                <a
                                    className="farmix-top-icon-link farmix-top-email"
                                    href={`mailto:${contactInfo.email}`}
                                    aria-label={`ایمیل: ${contactInfo.email}`}
                                >
                                    <i className="far fa-envelope" aria-hidden="true" />
                                </a>
                                <a
                                    className="farmix-top-icon-link farmix-top-instagram"
                                    href={contactInfo.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="اینستاگرام"
                                >
                                    <img src={farmixAsset('img/instagram.png')} alt="" width={38} height={30} />
                                </a>
                            </div>
                            <div className="header-links farmix-top-links">
                                <ul>
                                    <li className="farmix-top-link">
                                        <span className="farmix-top-link-icon" aria-hidden="true">
                                            <i className="far fa-map-marker-alt" />
                                        </span>
                                        <span className="farmix-top-link-text">{contactInfo.address}</span>
                                    </li>
                                    <li className="farmix-top-link">
                                        <span className="farmix-top-link-icon" aria-hidden="true">
                                            <i className="far fa-phone-alt" />
                                        </span>
                                        <a className="farmix-top-link-text" href={`tel:${contactInfo.phoneTel}`}>
                                            {contactInfo.phone}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    ref={stickyWrapperRef}
                    className={`sticky-wrapper${headerStuck ? ' will-sticky farmix-header-stuck' : ''}`}
                >
                    <div
                        ref={stickyBarRef}
                        className={`sticky-active${headerStuck ? ' active' : ''}`}
                    >
                        <div className="menu-area">
                            <div className="container">
                                <div className="farmix-header-bar">
                                    <div className="header-logo">
                                        <Link className="logo1" to="/">
                                            <img src={farmixAsset('img/logo-2.png')} alt="کارا ماشین وصال" />
                                        </Link>
                                        <Link className="logo2" to="/">
                                            <img src={farmixAsset('img/logo.png')} alt="کارا ماشین وصال" />
                                        </Link>
                                    </div>

                                    <div className="farmix-header-actions">
                                        <Link
                                            to="/products"
                                            className="farmix-header-action farmix-header-search"
                                        >
                                            <span className="farmix-header-action-label">جستجو</span>
                                            <i className="far fa-search" aria-hidden="true" />
                                        </Link>
                                        <button
                                            type="button"
                                            className="farmix-hamburger-btn"
                                            onClick={() => setMenuOpen(true)}
                                            aria-label="باز کردن فهرست"
                                            aria-expanded={menuOpen}
                                        >
                                            <span className="farmix-hamburger-label">فهرست</span>
                                            <HamburgerIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
