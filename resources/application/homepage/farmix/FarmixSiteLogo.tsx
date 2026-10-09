import { Link } from 'react-router-dom';
import {
    SITE_LOGO_ALT,
    SITE_LOGO_ON_DARK_BG,
    SITE_LOGO_ON_LIGHT_BG,
    siteLogoForBackground,
} from '../constants/siteLogo';

type FarmixSiteLogoProps = {
    /** auto: هدر (هیرو / چسبان) — با lightBackground سوییچ می‌شود */
    variant?: 'auto' | 'on-light' | 'on-dark';
    /** فقط برای variant=auto: نوار سفید چسبان */
    lightBackground?: boolean;
    className?: string;
    width?: number;
    height?: number;
    onClick?: () => void;
};

export function FarmixSiteLogo({
    variant = 'auto',
    lightBackground = false,
    className = '',
    width = 200,
    height = 56,
    onClick,
}: FarmixSiteLogoProps) {
    const src =
        variant === 'on-light'
            ? SITE_LOGO_ON_LIGHT_BG
            : variant === 'on-dark'
              ? SITE_LOGO_ON_DARK_BG
              : siteLogoForBackground(lightBackground);

    const rootClass = ['farmix-site-logo', className].filter(Boolean).join(' ');

    return (
        <Link className={rootClass} to="/" onClick={onClick}>
            <img
                className="farmix-site-logo__img"
                src={src}
                alt={SITE_LOGO_ALT}
                width={width}
                height={height}
                decoding="async"
            />
        </Link>
    );
}
