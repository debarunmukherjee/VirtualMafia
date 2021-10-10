<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoundDetailsSheriffsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('round_details_sheriffs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('round_id')->references('id')->on('game_rounds');
            $table->foreignId('checked_user_id')->references('id')->on('users');
            $table->foreignId('asked_by')->references('id')->on('users');
            $table->unique(['round_id', 'checked_user_id', 'asked_by']);
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
        Schema::dropIfExists('round_details_sheriffs');
    }
}
