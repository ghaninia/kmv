import { FormEvent, useState } from 'react';
import { contactInfo, footerQuickLinks } from '../data/homeData';

export function FooterSection() {
    const [email, setEmail] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email.trim()) {
            return;
        }

        window.open(
            `https://feedburner.google.com/fb/a/mailverify?uri=caramachine/wWLF&email=${encodeURIComponent(email)}`,
            'popupwindow',
            'scrollbars=yes,width=550,height=520',
        );
    };

    return (
        <>
            <div className="cm-footer-light">
                <div className="cm-container">
                    <ul>
                        {footerQuickLinks.map((link) => (
                            <li key={link.label} className={link.className}>
                                <a href={link.href} target="_blank" rel="noreferrer">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <footer className="cm-footer">
                <div className="cm-container">
                    <div className="cm-footer-grid">
                        <div className="cm-footer-map">
                            <div className="cm-footer-map-title" />
                            <span>آدرس : {contactInfo.address}</span>
                            <span>تلفن تماس : {contactInfo.phone}</span>
                            <span>فکس : {contactInfo.fax}</span>
                            <a className="cm-contact-btn" href={contactInfo.contactHref}>
                                تماس با ما
                            </a>
                        </div>

                        <div className="cm-footer-newsletter cm-footer-feedburner">
                            <div className="cm-footer-feedburner-title">اولین نفری که مطلع می شود، باشید!</div>
                            <div className="cm-footer-feedburner-body">
                                <span>
                                    با عضویت در خبر نامه سایت از جدیدترین رویداد ها در ایمیلتان با خبر شوید . در
                                    صورت آپدیت روزانه سایت ایمیلی حاوی مطالب برای شما ارسال میشود برای دریافت
                                    ایمیل کافی است ایمیل خود را بعد از ثبت نام تایید کنید .
                                </span>
                                <form className="cm-feedburner-form" onSubmit={handleSubmit}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="ایمیل خود را وارد کنید ..."
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                    <input type="submit" value="اشتراک در خبر نامه" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="cm-footer-bottom">
                <div className="cm-container">
                    <div className="cm-footer-copyright">
                        <p>تمام حقوق سایت متعلق به کارا ماشین وصال می باشد و کپی با ذکر منبع بلا مانع است .</p>
                    </div>
                </div>
            </div>
        </>
    );
}
