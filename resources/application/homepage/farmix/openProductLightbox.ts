import { resolveProductImage } from '../constants/productPlaceholder';
import { loadFarmixScripts } from './useFarmixScripts';

type MagnificPopupApi = {
    open: (
        options: {
            items: Array<{ src: string }>;
            type: string;
            gallery?: { enabled: boolean };
            mainClass?: string;
            removalDelay?: number;
        },
        index?: number,
    ) => void;
};

export async function openProductLightbox(imageUrls: string[], startIndex = 0): Promise<void> {
    if (imageUrls.length === 0) {
        return;
    }

    await loadFarmixScripts();

    const jQuery = (window as Window & { jQuery?: { magnificPopup?: MagnificPopupApi } }).jQuery;
    const magnificPopup = jQuery?.magnificPopup;

    if (!magnificPopup) {
        window.open(resolveProductImage(imageUrls[startIndex] ?? imageUrls[0]), '_blank', 'noopener,noreferrer');
        return;
    }

    const index = Math.min(Math.max(startIndex, 0), imageUrls.length - 1);

    magnificPopup.open(
        {
            items: imageUrls.map((url) => ({ src: resolveProductImage(url) })),
            type: 'image',
            gallery: { enabled: imageUrls.length > 1 },
            mainClass: 'mfp-farmix-product',
            removalDelay: 200,
        },
        index,
    );
}
