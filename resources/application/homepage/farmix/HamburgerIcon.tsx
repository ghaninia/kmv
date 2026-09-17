type HamburgerIconProps = {
    className?: string;
};

export function HamburgerIcon({ className }: HamburgerIconProps) {
    return (
        <span className={['farmix-hamburger-icon', className].filter(Boolean).join(' ')} aria-hidden="true">
            <span />
            <span />
            <span />
        </span>
    );
}
