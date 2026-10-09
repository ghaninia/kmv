import { ABOUT_VIDEO_SLIDES } from '../constants/aboutVideo';
import { FarmixAboutVideo } from './FarmixAboutVideo';

type FarmixAboutVideoPairProps = {
    className?: string;
};

export function FarmixAboutVideoPair({ className = '' }: FarmixAboutVideoPairProps) {
    const rootClass = ['farmix-about-video-pair', className].filter(Boolean).join(' ');

    return (
        <div className={rootClass} aria-label="ویدیوهای معرفی محصولات">
            {ABOUT_VIDEO_SLIDES.map((slide) => (
                <div key={slide.id} className="farmix-about-video-pair__item">
                    <FarmixAboutVideo src={slide.src} poster={slide.poster} label={slide.label} />
                </div>
            ))}
        </div>
    );
}
