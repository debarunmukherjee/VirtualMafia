<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoundDetailsDoctor extends Model
{
    use HasFactory;
    protected $fillable = [
        'round_id',
        'saved_user',
        'saved_by'
    ];

    public static function doctorsTurnCountForRound($roundId)
    {
        return self::where('round_id', $roundId)->count();
    }

    public static function recordDoctorResponse($roundId, $doctorUserId, $savedUserId): bool
    {
        $record = new RoundDetailsDoctor();
        $record->round_id = $roundId;
        $record->saved_user = $savedUserId;
        $record->saved_by = $doctorUserId;
        return $record->save();
    }
}
