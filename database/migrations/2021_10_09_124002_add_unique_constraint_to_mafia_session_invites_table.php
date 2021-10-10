<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUniqueConstraintToMafiaSessionInvitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mafia_session_invites', function (Blueprint $table) {
            $table->unique(['session_id', 'email']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('mafia_session_invites', function (Blueprint $table) {
            $table->dropUnique(['session_id', 'email']);
        });
    }
}
