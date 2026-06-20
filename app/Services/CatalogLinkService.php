<?php

namespace App\Services;

use App\Models\Catalog;
use App\Models\CatalogLink;

class CatalogLinkService
{
    /**
     * Create a public link for a catalog
     */
    public function createLink(
        Catalog $catalog,
        ?string $password = null,
        ?string $expiresAt = null
    ): CatalogLink {
        $link = new CatalogLink();
        $link->catalog_id = $catalog->id;
        $link->short_code = CatalogLink::generateShortCode();

        if ($password) {
            $link->password_hash = hash('sha256', $password);
        }

        if ($expiresAt) {
            $link->expires_at = $expiresAt;
        }

        $link->save();

        return $link;
    }

    /**
     * Get catalog by short code
     */
    public function getCatalogByShortCode(string $shortCode): ?CatalogLink
    {
        return CatalogLink::where('short_code', $shortCode)->first();
    }

    /**
     * Verify link password
     */
    public function verifyPassword(CatalogLink $link, string $password): bool
    {
        if ($link->isExpired()) {
            return false;
        }

        if (!$link->isPasswordProtected()) {
            return true;
        }

        return $link->verifyPassword($password);
    }

    /**
     * Delete a link
     */
    public function deleteLink(CatalogLink $link): bool
    {
        return $link->delete();
    }

    /**
     * Get all links for a catalog
     */
    public function getCatalogLinks(Catalog $catalog)
    {
        return $catalog->links()->latest()->get();
    }
}
