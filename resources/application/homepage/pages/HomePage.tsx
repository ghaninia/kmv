import { FooterSection } from '../components/FooterSection';
import { HeaderSection } from '../components/HeaderSection';
import { ProductsSection } from '../components/ProductsSection';

export function HomePage() {
    return (
        <>
            <HeaderSection />
            <ProductsSection />
            <FooterSection />
        </>
    );
}
