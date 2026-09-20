import { loadFarmixScripts } from './useFarmixScripts';

type JQueryLike = {
    (selector: string | Element): {
        each: (fn: (index: number, element: Element) => void) => void;
        hasClass: (name: string) => boolean;
        slick: (options: string | Record<string, unknown>) => void;
        attr: (name: string) => string | undefined;
        css: (name: string, value: string) => void;
        toggleClass: (name: string) => void;
        data: (key: string) => unknown;
        off: (event: string) => unknown;
        on: (event: string, handler: (event: Event) => void) => unknown;
    };
};

function readData($el: ReturnType<JQueryLike>, key: string): string | number | boolean | undefined {
    const value = $el.data(key);
    return value as string | number | boolean | undefined;
}

export async function initFarmix(): Promise<void> {
    await loadFarmixScripts();

    const $ = (window as Window & { jQuery?: JQueryLike }).jQuery;
    if (!$) {
        return;
    }

    $('[data-bg-src]').each((_index, element) => {
        const $element = $(element);
        const src = $element.attr('data-bg-src');
        if (src) {
            $element.css('background-image', `url(${src})`);
        }
    });

    $('.vs-carousel').each((_index, element) => {
        const $el = $(element);
        if ($el.hasClass('slick-initialized')) {
            $el.slick('unslick');
        }

        const slidesToShow = Number(readData($el, 'slide-show') ?? 1);
        const useArrows = Boolean(readData($el, 'arrows'));
        $el.slick({
            dots: Boolean(readData($el, 'dots')),
            fade: Boolean(readData($el, 'fade')),
            arrows: useArrows,
            prevArrow:
                '<button type="button" class="slick-prev" aria-label="اسلاید قبلی"><i class="far fa-chevron-left" aria-hidden="true"></i></button>',
            nextArrow:
                '<button type="button" class="slick-next" aria-label="اسلاید بعدی"><i class="far fa-chevron-right" aria-hidden="true"></i></button>',
            autoplay: readData($el, 'autoplay') === true,
            slidesToShow,
            centerMode: Boolean(readData($el, 'center-mode')),
            asNavFor: (readData($el, 'asnavfor') as string) || undefined,
            rtl: document.documentElement.dir === 'rtl',
            responsive: [
                {
                    breakpoint: 992,
                    settings: { slidesToShow: Number(readData($el, 'lg-slide-show') ?? slidesToShow) },
                },
                {
                    breakpoint: 768,
                    settings: { slidesToShow: Number(readData($el, 'md-slide-show') ?? slidesToShow) },
                },
            ],
        });
    });

    $('.scrollToTop').off('click.farmix').on('click.farmix', (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // React controls `.will-sticky` / `.active` on the header; disable theme scroll-hide logic.
    $(window).off('scroll');
    $(window).on('scroll.farmix', () => {
        const scrollTop = $(window).scrollTop() ?? 0;
        $('.scrollToTop').toggleClass('show', scrollTop > 500);
    });
    $(window).trigger('scroll.farmix');
}
