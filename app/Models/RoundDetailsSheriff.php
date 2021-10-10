<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoundDetailsSheriff extends Model
{
    use HasFactory;
    protected $fillable = [
        'round_id',
        'checked_user_id',
        'asked_by',
        'result'
    ];

    public static function sheriffsTurnCountForRound($roundId)
    {
        return self::where('round_id', $roundId)->count();
    }

    public static function recordSheriffResponse($roundId, $checkedUserId, $sheriffUserId, $result): bool
    {
        $record = new RoundDetailsSheriff();
        $record->round_id = $roundId;
        $record->checked_user_id = $checkedUserId;
        $record->asked_by = $sheriffUserId;
        $record->result = $result;
        return $record->save();
    }
}
