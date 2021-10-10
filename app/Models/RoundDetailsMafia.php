<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoundDetailsMafia extends Model
{
    use HasFactory;
    protected $fillable = [
        'round_id',
        'killed_user'
    ];

    public static function hasMafiaVotedForRound($roundId)
    {
        return self::where('round_id', $roundId)->exists();
    }

    public static function markMafiaKill($roundId, $killedUserId): bool
    {
        $record = new RoundDetailsMafia();
        $record->round_id = $roundId;
        $record->killed_user = $killedUserId;
        return $record->save();
    }
}
