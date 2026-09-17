import { useState } from 'react';
import { Link } from 'react-router-dom';
import { faqItems } from '../data/homeData';
import { FarmixPageHero } from '../farmix/FarmixPageHero';

const FAQ_ACCORDION_ID = 'farmix-faq-accordion';

export function FaqPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <>
            <FarmixPageHero
                title="پرسش و پاسخ"
                subtitle="پاسخ سوالات متداول درباره محصولات و خدمات کارا ماشین وصال"
                align="center"
            />
            <section className="faq-layout1 space farmix-faq-page farmix-storefront-page">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-xl-7">
                            <div className="accordion-style2 farmix-about-accordion farmix-faq-accordion">
                                <div className="accordion" id={FAQ_ACCORDION_ID}>
                                    {faqItems.map((item, index) => {
                                        const isOpen = openIndex === index;
                                        const panelId = `${FAQ_ACCORDION_ID}-panel-${index}`;
                                        const headingId = `${FAQ_ACCORDION_ID}-heading-${index}`;

                                        return (
                                            <div
                                                key={item.question}
                                                className={`accordion-item${isOpen ? ' is-open' : ''}`}
                                            >
                                                <h2 className="accordion-header" id={headingId}>
                                                    <button
                                                        type="button"
                                                        className={`accordion-button${isOpen ? '' : ' collapsed'}`}
                                                        aria-expanded={isOpen}
                                                        aria-controls={panelId}
                                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                                    >
                                                        {item.question}
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
                                                            <p>{item.answer}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="farmix-faq-cta">
                                <p className="farmix-faq-cta-text">سوال دیگری دارید؟</p>
                                <Link to="/contact" className="vs-btn style2 farmix-faq-cta-btn">
                                    تماس با ما
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
