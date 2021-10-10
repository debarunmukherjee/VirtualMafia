<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMafiaSessionMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mafia_session_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->references('id')->on('mafia_sessions')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            /*
             * role :
             * 0 => God
             * 1 => Villager
             * 2 => Mafia
             * 3 => Sheriff
             * 4 => Doctor
             */
            $table->tinyInteger('role')->nullable();
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
        Schema::dropIfExists('mafia_session_members');
    }
}
