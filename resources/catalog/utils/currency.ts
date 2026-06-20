/**
 * Currency helpers for the catalog storefront.
 *
 * Products are stored in USD; the Toman price is derived from a settings-driven
 * exchange rate. Persian (fa-IR) locale formatting is used for the Toman amount
 * so prices read naturally for an Iranian B2B audience.
 */

const TOMAN_FORMATTER = new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 0,
});

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
});

/**
 * Convert a USD price into Toman using the supplied exchange rate.
 *
 * @param priceUSD       Price of the product in US dollars.
 * @param usdToTomanRate Toman value of a single US dollar.
 */
export function convertUsdToToman(priceUSD: number, usdToTomanRate: number): number {
    return Math.round(priceUSD * usdToTomanRate);
}

/**
 * Format a USD price into a localized Toman string (Persian digits + label).
 *
 * @example formatTomanPrice(25, 50000) // "۱٬۲۵۰٬۰۰۰ تومان"
 */
export function formatTomanPrice(priceUSD: number, usdToTomanRate: number): string {
    const toman = convertUsdToToman(priceUSD, usdToTomanRate);
    return `${TOMAN_FORMATTER.format(toman)} تومان`;
}

/** Format an already-computed Toman amount with Persian digits and label. */
export function formatToman(toman: number): string {
    return `${TOMAN_FORMATTER.format(Math.round(toman))} تومان`;
}

/** Format a USD amount as a compact "$25.00 USD" style string. */
export function formatUsd(priceUSD: number): string {
    return `${USD_FORMATTER.format(priceUSD)} USD`;
}

/** Format an arbitrary integer using Persian digits (e.g. product counts). */
export function formatPersianNumber(value: number): string {
    return TOMAN_FORMATTER.format(value);
}
