import { Link } from 'react-router-dom';

type BreadcrumbItem = {
    label: string;
    href?: string;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="cm-breadcrumbs" aria-label="مسیر صفحه">
            <ol>
                <li>
                    <Link to="/">صفحه اصلی</Link>
                </li>
                {items.map((item, index) => (
                    <li key={`${item.label}-${index}`}>
                        {item.href ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
