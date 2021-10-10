<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGeneralVotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('general_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('round_id')->references('id')->on('game_rounds');
            $table->foreignId('kill_vote_by')->references('id')->on('users');
            $table->foreignId('kill_vote_to')->references('id')->on('users');
            $table->unique(['round_id', 'kill_vote_by', 'kill_vote_to']);
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
        Schema::dropIfExists('general_votes');
    }
}
