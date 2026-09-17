import { FarmixAbout } from '../farmix/FarmixAbout';
import { FarmixCategories } from '../farmix/FarmixCategories';
import { FarmixHero } from '../farmix/FarmixHero';
import { FarmixLayout } from '../farmix/FarmixLayout';
import { FarmixProducts } from '../farmix/FarmixProducts';

export function HomePage() {
    return (
        <FarmixLayout>
            <FarmixHero />
            <FarmixAbout />
            <FarmixCategories />
            <FarmixProducts />
        </FarmixLayout>
    );
}
