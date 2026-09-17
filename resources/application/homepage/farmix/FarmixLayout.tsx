import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FarmixFooter } from './FarmixFooter';
import { FarmixNewsletter } from './FarmixNewsletter';
import { FarmixHeader } from './FarmixHeader';
import { initFarmix } from './initFarmix';

type FarmixLayoutProps = {
    children: ReactNode;
};

export function FarmixLayout({ children }: FarmixLayoutProps) {
    const location = useLocation();

    useEffect(() => {
        const timer = window.setTimeout(() => {
            initFarmix().catch(() => undefined);
        }, 50);

        return () => window.clearTimeout(timer);
    }, [location.pathname, children]);

    return (
        <div className="farmix-theme">
            <FarmixHeader />
            {children}
            <FarmixNewsletter />
            <FarmixFooter />
            <a href="#" className="scrollToTop scroll-btn"><i className="fal fa-arrow-up" /></a>
        </div>
    );
}
