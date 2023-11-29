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
            'bien_nhan_actions', function (Blueprint $table) {
                $table->string('bien_nhan_id')->primary();
                $table->bigInteger('id_action')->unsigned();
                $table->foreign('bien_nhan_id')
                    ->references('id')
                    ->on('bien_nhan')
                    ->onDelete('CASCADE');
                $table->foreign('id_action')
                    ->references('id')
                    ->on('actions');
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bien_nhan_actions');
    }
};
