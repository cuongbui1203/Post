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
            'users', function (Blueprint $table) {
                $table->uuid('uuid')->primary()->unique();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password')->default('');
                $table->string('phone');
                $table->date('dob')->nullable();
                $table->bigInteger('address_id')->unsigned();
                $table->rememberToken();
                $table->foreign('address_id')
                    ->references('id')
                    ->on('address_details')
                    ->onDelete('CASCADE');
                
                $table->timestamps();
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
