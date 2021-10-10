<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsEndedColumnToMafiaSessions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mafia_sessions', function (Blueprint $table) {
            $table->boolean('is_ended')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('mafia_sessions', function (Blueprint $table) {
            $table->dropColumn('is_ended');
        });
    }
}
