import { useCallback, useEffect, useState } from 'react';
import type { Catalog, CatalogStatus } from '../types/catalog';
import { CatalogError, fetchCatalog } from '../utils/api';
import { clearStoredPassword, getStoredPassword, storePassword } from '../utils/storage';

type UseCatalogResult = {
    catalog: Catalog | null;
    status: CatalogStatus;
    /** Set when the most recent password attempt failed. */
    passwordError: string | null;
    /** True while a password submission is in flight. */
    isVerifying: boolean;
    /** Submit a password for a protected catalog. */
    submitPassword: (password: string) => Promise<void>;
    /** Re-run the initial load (used by error-state retry buttons). */
    retry: () => void;
};

/**
 * Load a catalog by slug and manage its lifecycle: loading, ready, password
 * gating, and the various error states.
 *
 * On mount it attempts an unauthenticated fetch. If the catalog is protected we
 * first try any password cached in session storage; otherwise we surface the
 * password gate. Successful password submissions are cached for the session.
 */
export function useCatalog(slug: string | undefined): UseCatalogResult {
    const [catalog, setCatalog] = useState<Catalog | null>(null);
    const [status, setStatus] = useState<CatalogStatus>('loading');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [reloadToken, setReloadToken] = useState(0);

    const load = useCallback(
        async (signal: AbortSignal) => {
            if (!slug) {
                setStatus('not-found');
                return;
            }

            setStatus('loading');
            setPasswordError(null);

            const cachedPassword = getStoredPassword(slug);

            try {
                const data = await fetchCatalog(slug, cachedPassword ?? undefined);
                if (signal.aborted) return;
                setCatalog(data);
                setStatus('ready');
            } catch (error) {
                if (signal.aborted) return;

                if (error instanceof CatalogError) {
                    // A stale cached password is no longer valid — drop it and
                    // fall back to the password gate.
                    if (error.kind === 'invalid-password') {
                        clearStoredPassword(slug);
                        setStatus('password-required');
                        return;
                    }

                    setStatus(mapErrorToStatus(error));
                    return;
                }

                setStatus('error');
            }
        },
        [slug],
    );

    useEffect(() => {
        const controller = new AbortController();
        void load(controller.signal);
        return () => controller.abort();
    }, [load, reloadToken]);

    const submitPassword = useCallback(
        async (password: string) => {
            if (!slug) return;

            setIsVerifying(true);
            setPasswordError(null);

            try {
                const data = await fetchCatalog(slug, password);
                storePassword(slug, password);
                setCatalog(data);
                setStatus('ready');
            } catch (error) {
                if (error instanceof CatalogError && error.kind === 'invalid-password') {
                    setPasswordError('Incorrect password. Please try again.');
                } else if (error instanceof CatalogError) {
                    setPasswordError(error.message);
                } else {
                    setPasswordError('Something went wrong. Please try again.');
                }
            } finally {
                setIsVerifying(false);
            }
        },
        [slug],
    );

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    return { catalog, status, passwordError, isVerifying, submitPassword, retry };
}

function mapErrorToStatus(error: CatalogError): CatalogStatus {
    switch (error.kind) {
        case 'password-required':
            return 'password-required';
        case 'not-found':
            return 'not-found';
        case 'expired':
            return 'expired';
        default:
            return 'error';
    }
}
