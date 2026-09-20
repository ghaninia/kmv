type IconRule = {
    pattern: RegExp;
    icon: string;
};

const CATEGORY_ICON_RULES: IconRule[] = [
    { pattern: /pump|پمپ|water|آب/i, icon: 'far fa-tint' },
    { pattern: /spray|سمپاش|tank|مخزن|nozzle|نازل/i, icon: 'fas fa-fill-drip' },
    { pattern: /filter|فیلتر/i, icon: 'far fa-filter' },
    { pattern: /valve|شیر|اتصال|fitting|pipe|لوله/i, icon: 'far fa-wrench' },
    { pattern: /motor|موتور|engine|توربین|turbine/i, icon: 'far fa-cog' },
    { pattern: /tractor|تراکتور|machine|ماشین|equipment|تجهیز/i, icon: 'far fa-tractor' },
    { pattern: /seed|بذر|fertil|کود|herb|علف/i, icon: 'far fa-seedling' },
    { pattern: /tool|ابزار|spare|یدکی|قطعه/i, icon: 'far fa-tools' },
    { pattern: /harvest|برداشت|crop|کشتاور/i, icon: 'far fa-apple-alt' },
];

const DEFAULT_CATEGORY_ICON = 'far fa-leaf';

export function getCategoryIconClass(slug?: string | null, name?: string | null): string {
    const haystack = `${slug ?? ''} ${name ?? ''}`.trim();
    if (!haystack) {
        return DEFAULT_CATEGORY_ICON;
    }

    for (const rule of CATEGORY_ICON_RULES) {
        if (rule.pattern.test(haystack)) {
            return rule.icon;
        }
    }

    return DEFAULT_CATEGORY_ICON;
}
