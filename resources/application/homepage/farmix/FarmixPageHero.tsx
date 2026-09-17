import { Breadcrumbs } from '../components/Breadcrumbs';
import { farmixAsset } from './assets';

export type FarmixPageHeroBreadcrumb = {
    label: string;
    href?: string;
};

type FarmixPageHeroProps = {
    title: string;
    subtitle?: string;
    breadcrumbs?: FarmixPageHeroBreadcrumb[];
    align?: 'start' | 'center';
};

export function FarmixPageHero({
    title,
    subtitle,
    breadcrumbs,
    align = 'start',
}: FarmixPageHeroProps) {
    const rootClass = [
        'farmix-page-hero',
        'breadcumb-wrapper',
        align === 'center' ? 'farmix-page-hero--center' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={rootClass} data-bg-src={farmixAsset('img/bg/hero-bg-3.jpg')}>
            <div className="farmix-page-hero-overlay" aria-hidden="true" />
            <div className="farmix-hero-grain farmix-page-hero-grain" aria-hidden="true" />
            <div className="container position-relative">
                {breadcrumbs && breadcrumbs.length > 0 ? (
                    <Breadcrumbs items={breadcrumbs} />
                ) : null}
                <div className="farmix-page-hero-inner">
                    <div className="title-img farmix-page-hero-icon">
                        <img src={farmixAsset('img/icon/title-logo.png')} alt="" />
                    </div>
                    <h1 className="sec-title farmix-page-hero-title">{title}</h1>
                    {subtitle ? <p className="farmix-page-hero-subtitle">{subtitle}</p> : null}
                </div>
            </div>
        </div>
    );
}
