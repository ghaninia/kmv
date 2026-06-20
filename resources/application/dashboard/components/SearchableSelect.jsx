import React from 'react';
import Select from 'react-select';

/**
 * Searchable dropdown built on react-select, styled to match the dashboard.
 *
 * Props:
 * - value: the currently selected raw value (string/number) or '' for none.
 * - onChange: receives the raw selected value (or '' when cleared).
 * - options: array of { value, label }.
 * - placeholder, isClearable, isDisabled, error, id.
 */
export const SearchableSelect = ({
    value,
    onChange,
    options = [],
    placeholder = 'انتخاب کنید...',
    isClearable = true,
    isDisabled = false,
    error,
    id,
    ...rest
}) => {
    const selectedOption =
        options.find((opt) => String(opt.value) === String(value)) ?? null;

    const styles = {
        control: (base, state) => ({
            ...base,
            minHeight: '42px',
            borderRadius: '0.5rem',
            borderColor: error
                ? '#ef4444'
                : state.isFocused
                ? 'transparent'
                : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : 'none',
            '&:hover': { borderColor: error ? '#ef4444' : '#d1d5db' },
            backgroundColor: state.isDisabled ? '#f9fafb' : 'white',
        }),
        valueContainer: (base) => ({ ...base, padding: '2px 12px' }),
        placeholder: (base) => ({ ...base, color: '#9ca3af' }),
        menu: (base) => ({
            ...base,
            borderRadius: '0.5rem',
            overflow: 'hidden',
            zIndex: 60,
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#2563eb'
                : state.isFocused
                ? '#eff6ff'
                : 'white',
            color: state.isSelected ? 'white' : '#111827',
            cursor: 'pointer',
        }),
    };

    return (
        <div>
            <Select
                inputId={id}
                value={selectedOption}
                onChange={(opt) => onChange(opt ? opt.value : '')}
                options={options}
                placeholder={placeholder}
                isClearable={isClearable}
                isDisabled={isDisabled}
                styles={styles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                classNamePrefix="searchable-select"
                {...rest}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
};
