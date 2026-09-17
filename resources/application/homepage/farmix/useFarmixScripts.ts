import { useEffect } from 'react';

const SCRIPTS = [
    '/farmix/assets/js/vendor/jquery-3.6.0.min.js',
    '/farmix/assets/js/slick.min.js',
    '/farmix/assets/js/bootstrap.min.js',
    '/farmix/assets/js/jquery.magnific-popup.min.js',
    '/farmix/assets/js/imagesloaded.pkgd.min.js',
    '/farmix/assets/js/isotope.pkgd.min.js',
    '/farmix/assets/js/main.js',
];

let loadPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
    });
}

export function loadFarmixScripts(): Promise<void> {
    if (!loadPromise) {
        loadPromise = SCRIPTS.reduce(
            (chain, src) => chain.then(() => loadScript(src)),
            Promise.resolve(),
        );
    }

    return loadPromise;
}

export function useFarmixScripts(enabled = true) {
    useEffect(() => {
        if (!enabled) {
            return;
        }

        loadFarmixScripts().catch(() => undefined);
    }, [enabled]);
}
