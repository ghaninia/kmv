import { FormEvent } from 'react';

type FarmixStorefrontSearchProps = {
    placeholder: string;
    defaultValue?: string;
    onSubmit: (search: string) => void;
};

export function FarmixStorefrontSearch({
    placeholder,
    defaultValue = '',
    onSubmit,
}: FarmixStorefrontSearchProps) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSubmit(String(formData.get('search') || ''));
    };

    return (
        <form className="farmix-storefront-search" onSubmit={handleSubmit}>
            <label className="farmix-contact-field farmix-storefront-search-field">
                <span className="farmix-contact-field-wrap">
                    <i className="far fa-search" aria-hidden="true" />
                    <input
                        className="form-control"
                        type="search"
                        name="search"
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                    />
                </span>
            </label>
            <button type="submit" className="vs-btn farmix-storefront-search-btn">جستجو</button>
        </form>
    );
}
