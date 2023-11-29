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
            "user_details", function (Blueprint $table) {
                $table->string('user_id')->primary();
                $table->string("work_plate_id");
                // $table->bigInteger("role_id")->unsigned()->nullable();
                $table->timestamps();
                $table->foreign("work_plate_id")
                    ->references("id")
                    ->on("work_plate");
                $table->foreign("user_id")
                    ->references("uuid")
                    ->on("users")->onDelete('CASCADE');
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("user_details");
    }
};
