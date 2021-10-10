<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoundDetailsMafiasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('round_details_mafias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('round_id')->references('id')->on('game_rounds');
            $table->foreignId('killed_user')->references('id')->on('users');
            $table->unique(['round_id', 'killed_user']);
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
        Schema::dropIfExists('round_details_mafias');
    }
}
