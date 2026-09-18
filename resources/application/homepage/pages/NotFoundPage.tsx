import { Link } from 'react-router-dom';
import { NotFoundIllustration } from '../components/NotFoundIllustration';
import { FarmixPageHero } from '../farmix/FarmixPageHero';

export function NotFoundPage() {
    return (
        <>
            <FarmixPageHero
                title="صفحه پیدا نشد"
                subtitle="آدرسی که وارد کرده‌اید وجود ندارد یا منتقل شده است"
                align="center"
            />
            <section className="farmix-storefront-page space farmix-not-found-page">
                <div className="container">
                    <div className="farmix-not-found-block text-center">
                        <NotFoundIllustration />
                        <p className="farmix-not-found-lead">
                            می‌توانید به صفحه اصلی برگردید یا از منو مسیر دیگری را انتخاب کنید.
                        </p>
                        <div className="farmix-not-found-actions">
                            <Link to="/" className="vs-btn">صفحه اصلی</Link>
                            <Link to="/products" className="vs-btn style2">مشاهده محصولات</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
