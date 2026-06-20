import React, { useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export const slugify = (value = '') =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/[\u0600-\u06FF]+/g, '') // strip Arabic/Persian letters
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '') // strip accents
        .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
        .replace(/[\s_]+/g, '-') // collapse whitespace/underscores to dash
        .replace(/-+/g, '-') // collapse multiple dashes
        .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes

const randomSuffix = () => Math.random().toString(36).slice(2, 8);

/**
 * Slug input field.
 * - When the field is empty (e.g. on create), it auto-fills from `source`.
 * - When the field already has a value (e.g. on edit), it is left untouched.
 * - The refresh button always generates a fresh slug from `source`.
 */
export const SlugInput = ({
    value,
    onChange,
    source = '',
    label = 'اسلاگ (نامک آدرس)',
    placeholder = 'در صورت خالی بودن خودکار ساخته می‌شود',
    error,
    disabled = false,
}) => {
    // Tracks whether the user has manually edited the field.
    const touchedRef = useRef(Boolean(value));

    // Auto-generate from source while the field is empty and untouched.
    useEffect(() => {
        if (touchedRef.current) return;
        if (value) return;
        const generated = slugify(source);
        if (generated) onChange(generated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source]);

    const handleInput = (e) => {
        touchedRef.current = true;
        onChange(slugify(e.target.value));
    };

    const handleRegenerate = () => {
        const base = slugify(source);
        const next = base ? `${base}-${randomSuffix()}` : randomSuffix();
        touchedRef.current = true;
        onChange(next);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    dir="ltr"
                    value={value}
                    onChange={handleInput}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full pl-4 pr-11 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-left disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={disabled}
                    title="ساخت اسلاگ جدید"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition disabled:opacity-50"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};
