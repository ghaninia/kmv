import { Outlet } from 'react-router-dom';
import { FarmixLayout } from '../farmix/FarmixLayout';

export function SiteLayout() {
    return (
        <FarmixLayout>
            <Outlet />
        </FarmixLayout>
    );
}
