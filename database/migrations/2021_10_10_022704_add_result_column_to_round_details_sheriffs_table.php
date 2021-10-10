<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddResultColumnToRoundDetailsSheriffsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('round_details_sheriffs', function (Blueprint $table) {
            $table->boolean('result');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('round_details_sheriffs', function (Blueprint $table) {
            $table->dropColumn('result');
        });
    }
}
