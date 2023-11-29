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
            "work_plate", function (Blueprint $table) {
                $table->uuid('id')->primary()->unique();
                $table->string("name");
                $table->bigInteger("address_id")->unsigned();
                $table->bigInteger("type_id")->unsigned();
                $table->string("vung");
                $table->bigInteger("cap")->unsigned();
                $table->timestamps();
                $table->foreign("address_id")
                    ->references("id")
                    ->on("address_details")
                    ->onDelete('CASCADE');
                $table->foreign("type_id")
                    ->references("id")
                    ->on("type");
                $table->foreign('cap')
                    ->references('id')
                    ->on('type');
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("work_plate");
    }
};
