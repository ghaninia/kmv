/**
 * Access-state persistence for password-protected catalogs.
 *
 * Verified passwords are stored in `sessionStorage` (per browser tab/session)
 * and mirrored to `localStorage` so reopening the same catalog link in a
 * new tab does not require re-authentication. Entries are scoped by the link
 * short code from the URL.
 */

const STORAGE_PREFIX = 'catalog_pw_';

function storageKey(slug: string): string {
    return `${STORAGE_PREFIX}${slug}`;
}

/** Read an optional password passed via `?password=` on the catalog URL. */
export function getPasswordFromUrl(): string | null {
    try {
        const password = new URLSearchParams(window.location.search).get('password');
        return password?.trim() ? password.trim() : null;
    } catch {
        return null;
    }
}

/** Remove a password query parameter from the address bar after successful auth. */
export function stripPasswordFromUrl(): void {
    try {
        const url = new URL(window.location.href);
        if (!url.searchParams.has('password')) {
            return;
        }

        url.searchParams.delete('password');
        const nextSearch = url.searchParams.toString();
        const nextUrl = `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}${url.hash}`;
        window.history.replaceState(window.history.state, '', nextUrl);
    } catch {
        /* Ignore history failures. */
    }
}

/** Read a previously stored password for the given catalog slug, if any. */
export function getStoredPassword(slug: string): string | null {
    try {
        return (
            window.sessionStorage.getItem(storageKey(slug)) ??
            window.localStorage.getItem(storageKey(slug))
        );
    } catch {
        // Private mode / disabled storage — fail open without persistence.
        return null;
    }
}

/** Resolve the password to try on initial load (URL param first, then storage). */
export function resolveInitialPassword(slug: string): string | null {
    return getPasswordFromUrl() ?? getStoredPassword(slug);
}

/** Persist a verified password for the given catalog slug. */
export function storePassword(slug: string, password: string): void {
    try {
        window.sessionStorage.setItem(storageKey(slug), password);
        window.localStorage.setItem(storageKey(slug), password);
    } catch {
        /* Ignore storage failures; access simply won't persist. */
    }
}

/** Remove any stored password for the given catalog slug. */
export function clearStoredPassword(slug: string): void {
    try {
        window.sessionStorage.removeItem(storageKey(slug));
        window.localStorage.removeItem(storageKey(slug));
    } catch {
        /* Ignore. */
    }
}
