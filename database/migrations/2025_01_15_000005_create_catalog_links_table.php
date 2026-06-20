<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catalog_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_id')->constrained()->onDelete('cascade');
            $table->string('short_code')->unique();
            $table->string('password_hash')->nullable();
            $table->string('password_plain')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('short_code');
            $table->index('catalog_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalog_links');
    }
};
