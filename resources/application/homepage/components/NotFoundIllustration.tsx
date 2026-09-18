import { PAGE_NOT_FOUND_IMAGE } from '../constants/pageNotFoundImage';

type NotFoundIllustrationProps = {
    className?: string;
};

export function NotFoundIllustration({ className = '' }: NotFoundIllustrationProps) {
    return (
        <img
            className={`farmix-not-found-img${className ? ` ${className}` : ''}`}
            src={PAGE_NOT_FOUND_IMAGE}
            alt=""
            width={320}
            height={320}
            decoding="async"
        />
    );
}
