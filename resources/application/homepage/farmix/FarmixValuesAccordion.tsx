import { useState } from 'react';

export type FarmixAccordionItem = {
    title: string;
    text: string;
};

type FarmixValuesAccordionProps = {
    items: FarmixAccordionItem[];
    id: string;
    defaultOpenIndex?: number | null;
};

export function FarmixValuesAccordion({
    items,
    id,
    defaultOpenIndex = null,
}: FarmixValuesAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

    return (
        <div className="accordion-style2 farmix-about-accordion">
            <div className="accordion" id={id}>
                {items.map((item, index) => {
                    const isOpen = openIndex === index;
                    const panelId = `${id}-panel-${index}`;
                    const headingId = `${id}-heading-${index}`;

                    return (
                        <div key={item.title} className={`accordion-item${isOpen ? ' is-open' : ''}`}>
                            <h2 className="accordion-header" id={headingId}>
                                <button
                                    type="button"
                                    className={`accordion-button${isOpen ? '' : ' collapsed'}`}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                >
                                    {item.title}
                                </button>
                            </h2>
                            <div
                                id={panelId}
                                className={`farmix-accordion-panel${isOpen ? ' is-open' : ''}`}
                                aria-labelledby={headingId}
                                role="region"
                                aria-hidden={!isOpen}
                            >
                                <div className="farmix-accordion-panel-inner">
                                    <div className="accordion-body">
                                        <p>{item.text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
