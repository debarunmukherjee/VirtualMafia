<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameRound extends Model
{
    use HasFactory;
    protected $fillable = [
        'session_id',
        'round_no',
        'time'
    ];

    public static function createSessionRound($sessionId, $time): int
    {
        $lastRoundDetails = self::getCurrentRoundDetailsForSession($sessionId);
        $round = new GameRound();
        $round->session_id = $sessionId;
        $round->round_no = $lastRoundDetails['number'] + 1;
        $round->time = $time;
        $round->save();
        return (int)$round->id;
    }

    public static function getCurrentRoundDetailsForSession($sessionId): array
    {
        $record = self::where('session_id', $sessionId)->orderBy('id', 'desc')->first();
        return [
            'id' => empty($record) ? 0 : $record->id,
            'number' => empty($record) ? 0 : $record->round_no,
            'time' => empty($record) ? '' : $record->time
        ];
    }

    public static function getProgressOfGodForCurrentNightRound($sessionId): array
    {
        $roundDetails = self::getCurrentRoundDetailsForSession($sessionId);
        $result = [];
        if (RoundDetailsMafia::hasMafiaVotedForRound($roundDetails['id'])) {
            $result['mafia'] = 'done';
            if (MafiaSessionMember::getCountOfAliveDoctors($sessionId) === RoundDetailsDoctor::doctorsTurnCountForRound($roundDetails['id'])) {
                $result['doctor'] = 'done';
                if (MafiaSessionMember::getCountOfAliveSheriffs($sessionId) === RoundDetailsSheriff::sheriffsTurnCountForRound($roundDetails['id'])) {
                    $result['sheriff'] = 'done';
                } else {
                    $result['sheriff'] = 'current';
                }
            } else {
                $result['doctor'] = 'current';
                $result['sheriff'] = 'future';
            }
        } else {
            $result['mafia'] = 'current';
            $result['doctor'] = 'future';
            $result['sheriff'] = 'future';
        }

        return $result;
    }
}
