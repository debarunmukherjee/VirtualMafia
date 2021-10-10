<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class MafiaSession extends Model
{
    use HasFactory;
    protected $fillable = [
        'slug',
        'name',
        'villager_count',
        'mafia_count',
        'sheriff_count',
        'doctor_count',
        'is_started',
        'is_ended'
    ];

    /**
     * @throws Exception
     */
    public static function isMafiaSessionStarted($mafiaSessionId): bool
    {
        $session = self::where('id', $mafiaSessionId)->first();
        if (empty($session)) {
            throw new Exception('Invalid Session ID');
        }
        return (bool) $session->is_started;
    }

    public static function getMafiaSessionIdFromSlug($slug): int
    {
        $session = self::where('slug', $slug)->first();
        return $session->id ?? 0;
    }

    public static function getMafiaSessionDetails($sessionId)
    {
        return self::where('id', $sessionId)->get([
            'slug',
            'name',
            'villager_count',
            'mafia_count',
            'sheriff_count',
            'doctor_count',
            'is_started',
            'is_ended',
        ])->toArray()[0];
    }

    public static function getOngoingGamesData($userId): array
    {
        $email = User::getUserDetails($userId)['email'];
        $createdEvents = self::join('mafia_session_members', 'mafia_session_members.session_id', '=', 'mafia_sessions.id')
            ->where([
                ['is_ended', '=', 0],
                ['role', '=', 0],
                ['user_id', '=', $userId],
            ])->get(['slug', 'name'])->toArray();
        $memberEvents = self::join('mafia_session_invites', 'mafia_session_invites.session_id', '=', 'mafia_sessions.id')
            ->where([
                ['is_ended', '=', 0],
                ['email', '=', $email],
                ['status', '=', 1]
            ])->get(['slug', 'name'])->toArray();
        return array_merge($createdEvents, $memberEvents);
    }

    public static function isSessionStarted($sessionId): bool
    {
        $record = self::where([
            ['id', '=', $sessionId],
            ['is_started', '=', 1],
        ])->get()->toArray();

        return !empty($record);
    }

    public static function isSessionEnded($sessionId): bool
    {
        $record = self::where([
            ['id', '=', $sessionId],
            ['is_ended', '=', 1],
        ])->get()->toArray();

        return !empty($record);
    }

    public static function getTotalMembersForMafiaSession($sessionId): int
    {
        $sessionDetails = self::getMafiaSessionDetails($sessionId);
        return (int)$sessionDetails['villager_count'] + (int)$sessionDetails['mafia_count'] +
            (int)$sessionDetails['sheriff_count'] + (int)$sessionDetails['doctor_count'];
    }

    public static function canAddMembersToSession($sessionId): bool
    {
        $totalMembers = self::getTotalMembersForMafiaSession($sessionId);
        $confirmedMembers = MafiaSessionInvite::where([
            ['session_id', '=', $sessionId],
            ['status', '=', 1]
        ])->count();

        return $totalMembers > $confirmedMembers;
    }

    public static function startMafiaGameSession($sessionId)
    {
        return DB::transaction(function () use ($sessionId) {
            $session = MafiaSession::where('id', $sessionId)->first();
            $session->is_started = 1;
            $result = $session->save();
            $result = $result && MafiaSessionMember::assignRolesToConfirmedPlayers($sessionId);
            return $result && GameRound::createSessionRound($sessionId, 'Night');
        });
    }

    public static function checkIfGameEnded($sessionId): array
    {
        $villagerCount = (int)MafiaSessionMember::getCountOfAliveVillagers($sessionId);
        $mafiaCount = (int)MafiaSessionMember::getCountOfAliveMafias($sessionId);
        $doctorCount = (int)MafiaSessionMember::getCountOfAliveDoctors($sessionId);
        $sheriffCount = (int)MafiaSessionMember::getCountOfAliveSheriffs($sessionId);

        if ($mafiaCount === 0) {
            return ['isEnded' => true, 'winner' => 'Town'];
        }

        if ($mafiaCount > $villagerCount+$doctorCount+$sheriffCount) {
            return ['isEnded' => true, 'winner' => 'Mafia'];
        }

        return ['isEnded' => false];
    }
}
