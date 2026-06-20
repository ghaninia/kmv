/**
 * Temporary access-state persistence for password-protected catalogs.
 *
 * When a visitor enters the correct password we keep it in `sessionStorage`
 * (scoped per slug) so a page refresh during the same browser session does not
 * force them to re-authenticate. Session storage is intentional: access should
 * not outlive the browsing session.
 */

const STORAGE_PREFIX = 'catalog_pw_';

function storageKey(slug: string): string {
    return `${STORAGE_PREFIX}${slug}`;
}

/** Read a previously stored password for the given catalog slug, if any. */
export function getStoredPassword(slug: string): string | null {
    try {
        return window.sessionStorage.getItem(storageKey(slug));
    } catch {
        // Private mode / disabled storage — fail open without persistence.
        return null;
    }
}

/** Persist a verified password for the given catalog slug. */
export function storePassword(slug: string, password: string): void {
    try {
        window.sessionStorage.setItem(storageKey(slug), password);
    } catch {
        /* Ignore storage failures; access simply won't persist. */
    }
}

/** Remove any stored password for the given catalog slug. */
export function clearStoredPassword(slug: string): void {
    try {
        window.sessionStorage.removeItem(storageKey(slug));
    } catch {
        /* Ignore. */
    }
}
