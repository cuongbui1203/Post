<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create(
            "bn_detail", function (Blueprint $table) {
                $table->string('id')->primary()->unique();
                // $table->bigInteger('status_id')->unsigned();
                $table->string('transport_id');
                $table->longText('description')->nullable();
                $table->timestamps();
                $table->foreign('id')->references('id')->on('bien_nhan')->onDelete('CASCADE');
                $table->foreign('transport_id')->references('id')->on('work_plate');
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bn_detail');
    }
};
