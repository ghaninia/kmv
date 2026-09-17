import { FormEvent, useState } from 'react';
import { contactInfo } from '../data/homeData';
import { submitContact } from '../api/storefront';
import { FarmixPageHero } from '../farmix/FarmixPageHero';
import { farmixAsset } from '../farmix/assets';

const contactChannels = [
    {
        icon: 'far fa-map-marker-alt',
        title: 'آدرس',
        content: contactInfo.address,
    },
    {
        icon: 'far fa-phone-alt',
        title: 'تلفن',
        content: (
            <a href={`tel:${contactInfo.phoneTel}`}>{contactInfo.phone}</a>
        ),
    },
    {
        icon: 'fas fa-fax',
        title: 'فکس',
        content: contactInfo.fax,
    },
    {
        icon: 'far fa-envelope',
        title: 'ایمیل',
        content: (
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
        ),
    },
] as const;

export function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        setStatus('loading');
        setMessage('');

        try {
            const responseMessage = await submitContact({
                name: String(formData.get('name') || ''),
                email: String(formData.get('email') || ''),
                phone: String(formData.get('phone') || ''),
                subject: String(formData.get('subject') || ''),
                message: String(formData.get('message') || ''),
            });
            setStatus('success');
            setMessage(responseMessage);
            event.currentTarget.reset();
        } catch {
            setStatus('error');
            setMessage('ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
        }
    };

    return (
        <>
            <FarmixPageHero
                title="تماس با ما"
                subtitle="برای مشاوره، سفارش یا هرگونه سوال با ما در ارتباط باشید"
                align="center"
            />
            <section className="contact-layout1 space farmix-contact-page">
                <div className="container">
                    <div className="row g-4 g-xl-5 align-items-stretch">
                        <div className="col-lg-5">
                            <aside className="farmix-contact-aside">
                                <div className="farmix-contact-aside-top">
                                    <img
                                        className="farmix-contact-aside-logo"
                                        src={farmixAsset('img/icon/title-logo.png')}
                                        alt=""
                                    />
                                    <h2 className="farmix-contact-aside-title">راه‌های ارتباطی</h2>
                                    <p className="farmix-contact-aside-lead">
                                        تیم فروش و پشتیبانی کارا ماشین وصال آماده پاسخگویی به سوالات
                                        فنی، استعلام قیمت و ثبت سفارش شماست.
                                    </p>
                                </div>

                                <div className="team-media farmix-contact-media">
                                    {contactChannels.map((channel) => (
                                        <div className="media-style1 farmix-contact-media-item" key={channel.title}>
                                            <div className="media-icon farmix-contact-media-icon" aria-hidden="true">
                                                <i className={channel.icon} />
                                            </div>
                                            <div className="media-body">
                                                <p className="media-title farmix-contact-media-label">{channel.title}</p>
                                                <p className="media-info farmix-contact-media-value">{channel.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="farmix-contact-aside-actions">
                                    <a
                                        href={contactInfo.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="farmix-contact-quick-link"
                                    >
                                        <i className="fab fa-instagram" aria-hidden="true" />
                                        اینستاگرام
                                    </a>
                                    <a href={`tel:${contactInfo.phoneTel}`} className="farmix-contact-quick-link">
                                        <i className="far fa-phone" aria-hidden="true" />
                                        تماس سریع
                                    </a>
                                </div>
                            </aside>
                        </div>

                        <div className="col-lg-7">
                            <form className="vs-comment-form farmix-contact-form" onSubmit={handleSubmit}>
                                <div className="comment-respond farmix-contact-form-inner">
                                    <span className="farmix-contact-form-kicker">فرم تماس</span>
                                    <h2 className="farmix-contact-form-title">پیام خود را بنویسید</h2>
                                    <p className="farmix-contact-form-lead">
                                        فرم زیر را پر کنید؛ در اسرع وقت با شما تماس می‌گیریم.
                                    </p>

                                    <div className="row g-3 g-md-4">
                                        <div className="col-md-6">
                                            <label className="farmix-contact-field">
                                                <span className="farmix-contact-field-label">نام و نام خانوادگی</span>
                                                <span className="farmix-contact-field-wrap">
                                                    <i className="far fa-user" aria-hidden="true" />
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="name"
                                                        placeholder="مثلاً علی محمدی"
                                                        required
                                                        autoComplete="name"
                                                    />
                                                </span>
                                            </label>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="farmix-contact-field">
                                                <span className="farmix-contact-field-label">ایمیل</span>
                                                <span className="farmix-contact-field-wrap">
                                                    <i className="far fa-envelope" aria-hidden="true" />
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        name="email"
                                                        placeholder="example@email.com"
                                                        required
                                                        autoComplete="email"
                                                    />
                                                </span>
                                            </label>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="farmix-contact-field">
                                                <span className="farmix-contact-field-label">تلفن</span>
                                                <span className="farmix-contact-field-wrap">
                                                    <i className="far fa-phone-alt" aria-hidden="true" />
                                                    <input
                                                        className="form-control"
                                                        type="tel"
                                                        name="phone"
                                                        placeholder="۰۹۱۲..."
                                                        autoComplete="tel"
                                                    />
                                                </span>
                                            </label>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="farmix-contact-field">
                                                <span className="farmix-contact-field-label">موضوع</span>
                                                <span className="farmix-contact-field-wrap">
                                                    <i className="far fa-tag" aria-hidden="true" />
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="subject"
                                                        placeholder="سفارش، مشاوره فنی، ..."
                                                    />
                                                </span>
                                            </label>
                                        </div>
                                        <div className="col-12">
                                            <label className="farmix-contact-field">
                                                <span className="farmix-contact-field-label">پیام</span>
                                                <span className="farmix-contact-field-wrap farmix-contact-field-wrap--textarea">
                                                    <i className="far fa-comment-alt" aria-hidden="true" />
                                                    <textarea
                                                        className="form-control"
                                                        name="message"
                                                        rows={5}
                                                        placeholder="متن پیام خود را اینجا بنویسید..."
                                                        required
                                                    />
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="farmix-contact-form-footer">
                                        <button
                                            type="submit"
                                            className="vs-btn farmix-contact-submit"
                                            disabled={status === 'loading'}
                                        >
                                            {status === 'loading' ? 'در حال ارسال...' : 'ارسال پیام'}
                                        </button>
                                        {message ? (
                                            <p
                                                className={`farmix-contact-feedback farmix-contact-feedback--${status}`}
                                                role="status"
                                            >
                                                {message}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
