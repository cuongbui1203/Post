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
            "notification_magic_post", function (Blueprint $table) {
                $table->uuid("id")->primary();
                $table->string('bien_nhan_id');
                $table->string('from_id');
                $table->string('to_id');
                $table->bigInteger('status_id')->unsigned();
                $table->longText('description');
                $table->timestamps();

                    
                $table->foreign('bien_nhan_id')->references('id')->on('bien_nhan')->onDelete('CASCADE');
                $table->foreign('from_id')->references('id')->on('work_plate');
                $table->foreign('to_id')->references('id')->on('work_plate');
                $table->foreign('status_id')->references('id')->on('status');
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("notification_magic_post");
    }
};