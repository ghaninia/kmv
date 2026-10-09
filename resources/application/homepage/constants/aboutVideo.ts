export type AboutVideoSlide = {
    id: string;
    src: string;
    poster: string;
    label: string;
};

/** ریلزهای بخش درباره ما — فایل‌ها در `public/videos/` و `public/images/` */
export const ABOUT_VIDEO_SLIDES: AboutVideoSlide[] = [
    {
        id: 'sprayer-tank',
        src: '/videos/about-kmv.mp4',
        poster: '/images/about-video-cover.jpg',
        label: 'مخزن سمپاش',
    },
    {
        id: 'ama-italy',
        src: '/videos/about-kmv-2.mp4',
        poster: '/images/about-video-cover-2.jpg',
        label: 'دیسک AMA ایتالیا',
    },
];

/** @deprecated از ABOUT_VIDEO_SLIDES استفاده کنید */
export const ABOUT_VIDEO_SRC = ABOUT_VIDEO_SLIDES[0].src;

/** @deprecated از ABOUT_VIDEO_SLIDES استفاده کنید */
export const ABOUT_VIDEO_POSTER = ABOUT_VIDEO_SLIDES[0].poster;
