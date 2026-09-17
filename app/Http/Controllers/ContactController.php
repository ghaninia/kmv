<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): JsonResponse
    {
        $payload = $request->validated();

        Log::info('Contact form submission', $payload);

        try {
            $recipient = config('mail.from.address');

            if ($recipient) {
                Mail::raw(
                    "نام: {$payload['name']}\n"
                    ."ایمیل: {$payload['email']}\n"
                    .'تلفن: '.($payload['phone'] ?? '—')."\n"
                    .'موضوع: '.($payload['subject'] ?? '—')."\n\n"
                    .$payload['message'],
                    function ($message) use ($payload, $recipient) {
                        $message->to($recipient)
                            ->replyTo($payload['email'], $payload['name'])
                            ->subject('پیام تماس با ما — '.($payload['subject'] ?? 'بدون موضوع'));
                    }
                );
            }
        } catch (\Throwable $exception) {
            Log::warning('Contact mail failed', [
                'error' => $exception->getMessage(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس می‌گیریم.',
        ]);
    }
}
