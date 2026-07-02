import { Navigate, Route, Routes } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { CatalogPage } from './pages/CatalogPage';
import { CartPage } from './pages/CartPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { OrdersPage } from './pages/OrdersPage';
import { EmptyState } from './components/EmptyState';

/**
 * Client-side routes for the public catalog SPA.
 *
 * Mounted under the `/catalog` basename (see `main.tsx`). A bare `/catalog`
 * visit redirects to a friendly not-found state since a slug is required.
 */
export function App() {
    return (
        <Routes>
            <Route path="/:slug/cart" element={<CartPage />} />
            <Route path="/:slug/orders" element={<OrdersPage />} />
            <Route path="/:slug/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/:slug" element={<CatalogPage />} />
            <Route path="/" element={<Navigate to="/missing" replace />} />
            <Route
                path="*"
                element={
                    <div className="flex min-h-dvh items-center justify-center bg-[#f4faf5] px-4 py-12">
                        <div className="w-full max-w-lg">
                            <EmptyState
                                icon={FileQuestion}
                                tone="danger"
                                title="کاتالوگ پیدا نشد"
                                description="هیچ کاتالوگی مشخص نشده است. لطفاً از لینک کامل کاتالوگی که در اختیارتان قرار گرفته استفاده کنید."
                            />
                        </div>
                    </div>
                }
            />
        </Routes>
    );
}
