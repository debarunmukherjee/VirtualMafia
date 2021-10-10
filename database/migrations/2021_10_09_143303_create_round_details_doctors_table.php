<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoundDetailsDoctorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('round_details_doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('round_id')->references('id')->on('game_rounds');
            $table->foreignId('saved_user')->references('id')->on('users');
            $table->foreignId('saved_by')->references('id')->on('users');
            $table->unique(['round_id', 'saved_user', 'saved_by']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('round_details_doctors');
    }
}
