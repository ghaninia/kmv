<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currency_logs', function (Blueprint $table) {
            $table->id();
            $table->string('currency')->default('USD_IRR');
            $table->unsignedBigInteger('rate')->comment('Exchange rate in cents');
            $table->string('source')->nullable()->comment('API source');
            $table->timestamp('requested_at')->nullable();
            $table->timestamps();

            $table->index('currency');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('currency_logs');
    }
};
