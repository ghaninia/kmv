import { Link } from 'react-router-dom';
import { aboutContent } from '../data/homeData';
import { farmixAsset } from './assets';
import { FarmixValuesAccordion } from './FarmixValuesAccordion';

export function FarmixAbout() {
    const items = aboutContent.values;

    return (
        <section className="about-layout3 space farmix-about-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div
                            className="title-area mb-60 text-center wow fadeInUp wow-animated"
                            data-wow-delay="0.3s"
                        >
                            <div className="title-img">
                                <img src={farmixAsset('img/icon/title-logo.png')} alt="" />
                            </div>
                            <h2 className="sec-title">
                                مأموریت ما تأمین <span>تجهیزات باکیفیت</span> برای کشاورزی ایران است
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="row gy-5 gx-5 align-items-center">
                    <div className="col-lg-6">
                        <div className="about-content">
                            <p className="about-text">{aboutContent.intro}</p>
                            <FarmixValuesAccordion id="farmix-about-accordion" items={items} />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="about-img">
                            <img
                                src={farmixAsset('img/about/about-bg-2-1.jpg')}
                                alt="درباره کارا ماشین وصال"
                                className="img1"
                            />
                            <div className="img-content">
                                <h2 className="img-title h4">همراه مطمئن مزارع و کشاورزان سراسر کشور</h2>
                                <Link to="/about" className="vs-btn">درباره ما</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="shape-mockup moving z-index-n1 d-none d-xxl-block"
                style={{ right: '9%', bottom: '22%' }}
            >
                <img src={farmixAsset('img/shep/about-shep-1.png')} alt="" />
            </div>
        </section>
    );
}
