<?php

namespace App\Console\Commands;

use App\Services\CurrencyService;
use Illuminate\Console\Command;

class UpdateCurrencyCommand extends Command
{
    protected $signature = 'currency:update';

    protected $description = 'Update USD to Toman exchange rate from external API';

    protected CurrencyService $currencyService;

    public function __construct(CurrencyService $currencyService)
    {
        parent::__construct();
        $this->currencyService = $currencyService;
    }

    public function handle(): int
    {
        $this->info('Fetching latest USD to Toman exchange rate...');

        try {
            // Try to fetch from external API
            $rate = $this->currencyService->fetchLatestRate();

            if (!$rate) {
                $this->warn('Could not fetch rate from external API. Using current rate.');
                $this->info('Current rate: ' . $this->currencyService->getFormattedRate() . ' تومان');
                return self::FAILURE;
            }

            $this->currencyService->updateRate($rate, 'API');

            $this->info('Exchange rate updated successfully!');
            $this->info('New rate: ' . $this->currencyService->getFormattedRate() . ' تومان');

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error updating currency rate: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
