import { FormEvent, useState } from 'react';
import { farmixAsset } from './assets';

export function FarmixNewsletter() {
    const [email, setEmail] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = email.trim();
        if (!value) {
            return;
        }

        window.open(
            `https://feedburner.google.com/fb/a/mailverify?uri=caramachine/wWLF&email=${encodeURIComponent(value)}`,
            'popupwindow',
            'scrollbars=yes,width=550,height=520',
        );
        setEmail('');
    };

    return (
        <div className="subscribe-layout1 farmix-newsletter">
            <div className="container">
                <div className="subscribe-style1 farmix-subscribe-style1">
                    <div className="row align-items-center justify-content-between g-4 z-index-common">
                        <div className="col-lg-6">
                            <div className="subscribe-inner farmix-subscribe-inner">
                                <span className="subscribe-icon" aria-hidden="true">
                                    <i className="far fa-paper-plane" />
                                </span>
                                <div className="subscribe-title">
                                    <span className="sec-subtitle">خبرنامه</span>
                                    <h2 className="sec-title">اولین نفر باشید که مطلع می‌شوید</h2>
                                    <p className="farmix-subscribe-lead">
                                        با عضویت در خبرنامه از محصولات جدید، موجودی و اخبار کارا ماشین وصال
                                        باخبر شوید.
                                    </p>
                                </div>
                            </div>
                            <form className="newsletter-form farmix-newsletter-form" onSubmit={handleSubmit}>
                                <div className="search-btn farmix-newsletter-field">
                                    <input
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        placeholder="ایمیل خود را وارد کنید..."
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                    <button type="submit" className="vs-btn">عضویت</button>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block">
                            <div className="subscribe-img farmix-subscribe-img">
                                <img src={farmixAsset('img/bg/subscribe-img1.png')} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
