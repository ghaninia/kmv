<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_id')->constrained()->onDelete('cascade');
            $table->foreignId('catalog_link_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->text('customer_note')->nullable();
            $table->string('status')->default('pending');
            $table->unsignedBigInteger('subtotal_usd')->comment('Subtotal in USD cents');
            $table->unsignedBigInteger('subtotal_toman')->comment('Subtotal in Toman cents');
            $table->unsignedBigInteger('usd_to_toman_rate')->comment('Rate snapshot in cents');
            $table->timestamps();

            $table->index('status');
            $table->index('catalog_id');
            $table->index('created_at');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name');
            $table->unsignedInteger('quantity');
            $table->unsignedBigInteger('unit_price_usd')->comment('Unit price in USD cents');
            $table->unsignedBigInteger('unit_price_toman')->comment('Unit price in Toman cents');
            $table->unsignedBigInteger('line_total_usd')->comment('Line total in USD cents');
            $table->unsignedBigInteger('line_total_toman')->comment('Line total in Toman cents');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
