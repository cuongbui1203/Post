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
            "bien_nhan", function (Blueprint $table) {
                $table->uuid("id")->primary()->unique();
                $table->bigInteger("id_ng_gui")->nullable();
                $table->string("ten_ng_gui");
                $table->string("sdt_ng_gui");
                $table->string("ten_ng_nhan");
                $table->string("sdt_ng_nhan");
                $table->bigInteger("type_id")->unsigned()->nullable(false);
                $table->string("action")->default(json_encode([]));
                $table->bigInteger("id_address_ng_gui")->unsigned()->nullable(false);
                $table->bigInteger("id_address_ng_nhan")->unsigned();
                $table->integer("mass");
                $table->longText("nd");
                $table->longText("note")->nullable();
                $table->bigInteger("status_id")->unsigned()->nullable(false)->default(5);
                $table->dateTime("ngay_gui")->nullable();
                $table->dateTime("ngay_nhan")->nullable();
                $table->integer("cod")->unsigned()->default(0);
                $table->timestamps();
                
                $table->foreign("id_address_ng_gui")
                    ->references("id")
                    ->on("address_details")
                    ->onDelete('CASCADE');
                $table->foreign("id_address_ng_nhan")
                    ->references("id")
                    ->on("address_details")
                    ->onDelete('CASCADE');
                $table->foreign("type_id")
                    ->references("id")
                    ->on("type");
                $table->foreign("status_id")
                    ->references("id")
                    ->on("status");
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists("bien_nhan");
    }
};