import React from 'react';

/**
 * Format a raw numeric string for display with thousand separators.
 * Keeps a trailing dot / decimals so the user can keep typing.
 */
const formatDisplay = (raw, allowDecimals) => {
    if (raw === '' || raw === null || raw === undefined) return '';
    const str = String(raw);
    const negative = str.startsWith('-');
    const unsigned = negative ? str.slice(1) : str;
    const [intPart, ...decRest] = unsigned.split('.');
    const intFormatted = (intPart || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let result = intFormatted;
    if (allowDecimals && unsigned.includes('.')) {
        result = `${intFormatted}.${decRest.join('')}`;
    }
    return negative ? `-${result}` : result;
};

/**
 * Strip everything except digits (and an optional single decimal point)
 * so the value passed to onChange is a clean numeric string.
 */
const sanitize = (input, allowDecimals, allowNegative) => {
    let cleaned = String(input).replace(/,/g, '');
    const pattern = allowDecimals ? /[^0-9.]/g : /[^0-9]/g;
    const negative = allowNegative && cleaned.trim().startsWith('-');
    cleaned = cleaned.replace(pattern, '');
    if (allowDecimals) {
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = `${parts[0]}.${parts.slice(1).join('')}`;
        }
    }
    return negative ? `-${cleaned}` : cleaned;
};

/**
 * Price input with live thousand-separator formatting.
 *
 * - `value` is the raw numeric value (string or number) without separators.
 * - `onChange` receives the raw numeric string (e.g. "1234.56"), ready to send to the API.
 * - Set `allowDecimals={false}` for whole-number currencies (e.g. Toman).
 */
export const PriceInput = ({
    value,
    onChange,
    label,
    prefix,
    suffix,
    allowDecimals = true,
    allowNegative = false,
    error,
    required = false,
    disabled = false,
    placeholder = '0',
    className = '',
    inputClassName = '',
    ...rest
}) => {
    const handleChange = (e) => {
        const cleaned = sanitize(e.target.value, allowDecimals, allowNegative);
        onChange(cleaned);
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                        {prefix}
                    </span>
                )}
                <input
                    type="text"
                    dir="ltr"
                    inputMode={allowDecimals ? 'decimal' : 'numeric'}
                    value={formatDisplay(value, allowDecimals)}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-left disabled:bg-gray-50 disabled:text-gray-400 ${
                        prefix ? 'pl-7' : 'pl-4'
                    } ${suffix ? 'pr-16' : 'pr-4'} ${inputClassName}`}
                    {...rest}
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                        {suffix}
                    </span>
                )}
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};
