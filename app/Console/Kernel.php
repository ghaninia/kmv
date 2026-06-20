<?php

namespace App\Console;

use App\Console\Commands\UpdateCurrencyCommand;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Run currency update every day at 12:00 PM
        $schedule->command(UpdateCurrencyCommand::class)
            ->dailyAt('12:00')
            ->onSuccess(function () {
                \Illuminate\Support\Facades\Log::info('Currency rate updated successfully');
            })
            ->onFailure(function () {
                \Illuminate\Support\Facades\Log::error('Failed to update currency rate');
            });
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
