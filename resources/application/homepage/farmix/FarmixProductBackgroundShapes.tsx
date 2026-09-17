import { farmixAsset } from './assets';

/** دکور پس‌زمینه متحرک سکشن محصولات (مثل index-3.html) */
export function FarmixProductBackgroundShapes() {
    return (
        <>
            <div
                className="shape-mockup moving z-index d-none d-lg-block farmix-product-shep farmix-product-shep--2"
                style={{ left: '2%', bottom: '22%' }}
                aria-hidden="true"
            >
                <img src={farmixAsset('img/shep/product-shep-2.png')} alt="" />
            </div>
            <div
                className="shape-mockup moving z-index d-none d-lg-block farmix-product-shep farmix-product-shep--1"
                style={{ right: '2%', bottom: '22%' }}
                aria-hidden="true"
            >
                <img src={farmixAsset('img/shep/product-shep-1.png')} alt="" />
            </div>
        </>
    );
}
