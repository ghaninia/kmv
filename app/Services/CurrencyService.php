<?php

namespace App\Services;

use App\Models\CurrencyLog;
use App\Models\Setting;

class CurrencyService
{
    /**
     * Get current USD to Toman rate
     */
    public function getCurrentRate(): int
    {
        return (int) Setting::get('usd_rate', 85000000);
    }

    /**
     * Update the currency rate
     */
    public function updateRate(int $rate, ?string $source = null): void
    {
        Setting::set('usd_rate', $rate);
        CurrencyLog::logRate($rate, $source);
    }

    /**
     * Get formatted rate for display
     */
    public function getFormattedRate(): string
    {
        $rate = $this->getCurrentRate();
        $toman = $rate / 100;

        return number_format($toman, 0, '.', ',');
    }

    /**
     * Convert USD amount to Toman
     */
    public function convertToToman(int $usdCents): int
    {
        $rate = $this->getCurrentRate();

        return (int) ($usdCents * $rate / 100);
    }

    /**
     * Fetch latest rate from external API
     * This can be extended to call real APIs
     */
    public function fetchLatestRate(): ?int
    {
        // Example implementation - can be extended to call real APIs
        // like CoinGecko, Open Exchange Rates, etc.
        return null;
    }

    /**
     * Get rate history
     */
    public function getHistory(int $days = 30)
    {
        return CurrencyLog::where('currency', 'USD_IRR')
            ->where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at')
            ->get(['rate', 'created_at']);
    }
}
