<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catalog_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('custom_price_usd')->nullable()->comment('Custom price in cents');
            $table->timestamps();

            $table->unique(['catalog_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalog_product');
    }
};
