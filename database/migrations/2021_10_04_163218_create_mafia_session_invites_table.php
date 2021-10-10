<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMafiaSessionInvitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mafia_session_invites', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->foreignId('session_id')->references('id')->on('mafia_sessions')->onDelete('cascade');
            /*
             * status :
             * 0 => Pending
             * 1 => Accepted
             * 2 => Rejected
             */
            $table->tinyInteger('status');
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
        Schema::dropIfExists('mafia_session_invites');
    }
}
