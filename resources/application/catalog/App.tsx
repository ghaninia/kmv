import { Navigate, Route, Routes } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { CatalogPage } from './pages/CatalogPage';
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
            <Route path="/:slug" element={<CatalogPage />} />
            <Route path="/" element={<Navigate to="/missing" replace />} />
            <Route
                path="*"
                element={
                    <div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-12">
                        <div className="w-full max-w-lg">
                            <EmptyState
                                icon={FileQuestion}
                                tone="danger"
                                title="Catalog not found"
                                description="No catalog was specified. Please use the full catalog link provided to you."
                            />
                        </div>
                    </div>
                }
            />
        </Routes>
    );
}
