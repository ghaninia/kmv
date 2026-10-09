/** لوگو روی پس‌زمینه تیره — المان‌های روشن (`kmv-logo.png`) */
export const SITE_LOGO_ON_DARK_BG = '/images/kmv-logo.png';

/** لوگو روی پس‌زمینه روشن — المان‌های تیره (`kmv-logo-light-bg.png`) */
export const SITE_LOGO_ON_LIGHT_BG = '/images/kmv-logo-light-bg.png';

export function siteLogoForBackground(lightBackground: boolean): string {
    return lightBackground ? SITE_LOGO_ON_LIGHT_BG : SITE_LOGO_ON_DARK_BG;
}

export const SITE_LOGO_ALT = 'کارا ماشین وصال — Caramachine Vesal';

/** @deprecated از SITE_LOGO_ON_DARK_BG یا SITE_LOGO_ON_LIGHT_BG استفاده کنید */
export const SITE_LOGO = SITE_LOGO_ON_DARK_BG;
