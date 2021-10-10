<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class GeneralVote extends Model
{
    use HasFactory;
    protected $fillable = [
        'round_id',
        'kill_vote_by',
        'kill_vote_to'
    ];

    public static function getKillVotesForUsers($roundId)
    {
        $result = self::where('round_id', $roundId)
            ->select('kill_vote_to', DB::raw("count(kill_vote_by) as total_votes"))
            ->groupBy('kill_vote_to')
            ->orderBy('total_votes', 'DESC')
            ->get()->toArray();
        return $result;
    }
}
