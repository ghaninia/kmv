<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CurrencyLog;
use App\Services\CurrencyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    protected CurrencyService $currencyService;

    public function __construct(CurrencyService $currencyService)
    {
        $this->currencyService = $currencyService;
    }

    /**
     * Get current exchange rate
     */
    public function getRate(): JsonResponse
    {
        $rate = $this->currencyService->getCurrentRate();
        $formattedRate = $this->currencyService->getFormattedRate();

        return response()->json([
            'data' => [
                'rate' => $rate,
                'rate_formatted' => $formattedRate,
                'currency' => 'USD_IRR',
            ],
        ]);
    }

    /**
     * Update exchange rate
     */
    public function updateRate(Request $request): JsonResponse
    {
        $request->validate([
            'rate' => ['required', 'integer', 'min:0'],
            'source' => ['nullable', 'string', 'max:255'],
        ]);

        $this->currencyService->updateRate(
            $request->input('rate'),
            $request->input('source')
        );

        return response()->json([
            'success' => true,
            'message' => 'Exchange rate updated successfully',
            'data' => [
                'rate' => $this->currencyService->getCurrentRate(),
                'rate_formatted' => $this->currencyService->getFormattedRate(),
            ],
        ]);
    }

    /**
     * Get currency history
     */
    public function history(Request $request): JsonResponse
    {
        $days = $request->input('days', 30);
        $history = $this->currencyService->getHistory($days);

        return response()->json([
            'data' => $history->map(fn ($log) => [
                'rate' => $log->rate,
                'rate_formatted' => number_format($log->rate / 100, 0, '.', ','),
                'date' => $log->created_at->format('Y-m-d'),
                'created_at' => $log->created_at,
            ]),
        ]);
    }
}
