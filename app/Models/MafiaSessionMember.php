<?php

namespace App\Models;

define('GOD_ROLE_ID', 0);
define('VILLAGER_ROLE_ID', 1);
define('MAFIA_ROLE_ID', 2);
define('SHERIFF_ROLE_ID', 3);
define('DOCTOR_ROLE_ID', 4);

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MafiaSessionMember extends Model
{
    use HasFactory;
    protected $fillable = [
        'session_id',
        'user_id',
        'role'
    ];

    /**
     * @throws Exception
     */
    public static function getRoleIdFromRole($role): int
    {
        switch ($role) {
            case 'god':
                $roleId = GOD_ROLE_ID;
                break;
            case 'mafia':
                $roleId = MAFIA_ROLE_ID;
                break;
            case 'villager':
                $roleId = VILLAGER_ROLE_ID;
                break;
            case 'sheriff':
                $roleId = SHERIFF_ROLE_ID;
                break;
            case 'doctor':
                $roleId = DOCTOR_ROLE_ID;
                break;
            default:
                throw new Exception('Invalid role.');
        }

        return $roleId;
    }

    public static function getRoleFromRoleId($roleId): string
    {
        switch ($roleId) {
            case GOD_ROLE_ID:
                $role = 'god';
                break;
            case MAFIA_ROLE_ID:
                $role = 'mafia';
                break;
            case VILLAGER_ROLE_ID:
                $role = 'villager';
                break;
            case SHERIFF_ROLE_ID:
                $role = 'sheriff';
                break;
            case DOCTOR_ROLE_ID:
                $role = 'doctor';
                break;
            default:
                $role = '';
        }

        return $role;
    }

    /**
     * @throws Exception
     */
    public static function addMafiaSessionMember($userId, $role, $sessionId): bool
    {
        $roleId = self::getRoleIdFromRole($role);

        $mafiaSessionMember = new MafiaSessionMember();
        $mafiaSessionMember->session_id = $sessionId;
        $mafiaSessionMember->user_id = $userId;
        $mafiaSessionMember->role = $roleId;

        return $mafiaSessionMember->save();
    }

    public static function memberHasRole($userId, $sessionId, $role): bool
    {
        try {
            return self::where([
                ['user_id', '=', $userId],
                ['session_id', '=', $sessionId],
                ['role', '=', self::getRoleIdFromRole($role)],
            ])->exists();
        } catch (Exception $e) {
            return false;
        }
    }

    public static function assignRolesToConfirmedPlayers($sessionId): bool
    {
        $emailList = array_column(MafiaSessionInvite::getConfirmedPlayersForSession($sessionId), 'email');
        $userIds = array_column(User::getUserIdsFromEmailList($emailList), 'id');

        shuffle($userIds);
        $result = true;
        $sessionDetails = MafiaSession::getMafiaSessionDetails($sessionId);

        $mafiaCount = $sessionDetails['mafia_count'];
        $sheriffCount = $sessionDetails['sheriff_count'];
        $doctorCount = $sessionDetails['doctor_count'];

        for ($i = 0; $i<$mafiaCount; $i++) {
            $userId = array_pop($userIds);
            $member = new MafiaSessionMember();
            $member->session_id = $sessionId;
            $member->user_id = $userId;
            $member->role = MAFIA_ROLE_ID;
            $result = $result && $member->save();
        }

        for ($i = 0; $i<$sheriffCount; $i++) {
            $userId = array_pop($userIds);
            $member = new MafiaSessionMember();
            $member->session_id = $sessionId;
            $member->user_id = $userId;
            $member->role = SHERIFF_ROLE_ID;
            $result = $result && $member->save();
        }

        for ($i = 0; $i<$doctorCount; $i++) {
            $userId = array_pop($userIds);
            $member = new MafiaSessionMember();
            $member->session_id = $sessionId;
            $member->user_id = $userId;
            $member->role = DOCTOR_ROLE_ID;
            $result = $result && $member->save();
        }

        while (!empty($userIds)) {
            $userId = array_pop($userIds);
            $member = new MafiaSessionMember();
            $member->session_id = $sessionId;
            $member->user_id = $userId;
            $member->role = VILLAGER_ROLE_ID;
            $result = $result && $member->save();
        }

        return $result;
    }

    public static function getCountOfAlivePeople($sessionId): int
    {
        $nightDeadCount = GameRound::join('mafia_kills', 'mafia_kills.round_id', '=', 'game_rounds.id')
            ->where('session_id', $sessionId)->count();
        $dayDeadCount = GameRound::join('round_details_commons', 'round_details_commons.round_id', '=', 'game_rounds.id')
            ->where('session_id', $sessionId)->count();

        return MafiaSession::getTotalMembersForMafiaSession($sessionId) - ($nightDeadCount + $dayDeadCount);
    }

    public static function getDeadUserIdsForSession($sessionId): array
    {
        $nightDeadUids = GameRound::join('mafia_kills', 'mafia_kills.round_id', '=', 'game_rounds.id')
            ->where('session_id', $sessionId)->get(['killed_user'])->toArray();
        $dayDeadUids = GameRound::join('round_details_commons', 'round_details_commons.round_id', '=', 'game_rounds.id')
            ->where('session_id', $sessionId)->get(['killed_user'])->toArray();

        return array_column(array_merge($nightDeadUids, $dayDeadUids), 'killed_user');
    }

    public static function getCountOfAliveVillagers($sessionId): int
    {
        $deadUserIds = self::getDeadUserIdsForSession($sessionId);
        return self::where([
            ['session_id', '=', $sessionId],
            ['role', '=', VILLAGER_ROLE_ID],
        ])
            ->whereNotIn('user_id', $deadUserIds)
            ->count();
    }

    public static function getCountOfAliveMafias($sessionId): int
    {
        $deadUserIds = self::getDeadUserIdsForSession($sessionId);
        return self::where([
            ['session_id', '=', $sessionId],
            ['role', '=', MAFIA_ROLE_ID],
        ])
            ->whereNotIn('user_id', $deadUserIds)
            ->count();
    }

    public static function getCountOfAliveSheriffs($sessionId): int
    {
        $deadUserIds = self::getDeadUserIdsForSession($sessionId);
        return self::where([
            ['session_id', '=', $sessionId],
            ['role', '=', SHERIFF_ROLE_ID],
        ])
            ->whereNotIn('user_id', $deadUserIds)
            ->count();
    }

    public static function getCountOfAliveDoctors($sessionId): int
    {
        $deadUserIds = self::getDeadUserIdsForSession($sessionId);
        return self::where([
            ['session_id', '=', $sessionId],
            ['role', '=', DOCTOR_ROLE_ID],
        ])
            ->whereNotIn('user_id', $deadUserIds)
            ->count();
    }

    public static function getRoleIdOfMember($sessionId, $userId): int
    {
        return (int)self::where([
            ['session_id', '=', $sessionId],
            ['user_id', '=', $userId]
        ])->first()->role;
    }

    public static function getAlivePeopleData($sessionId)
    {
        $deadUserIds = self::getDeadUserIdsForSession($sessionId);
        $aliveUsers = self::where([
            ['session_id', '=', $sessionId],
            ['role', '<>', GOD_ROLE_ID]
        ])
            ->whereNotIn('user_id', $deadUserIds)
            ->get(['user_id'])
            ->toArray();
        $aliveUserIds = array_column($aliveUsers, 'user_id');
        return User::whereIn('id', $aliveUserIds)->get(['name', 'email'])->toArray();
    }

    public static function getPendingDoctorsDataForCurrentRound($sessionId)
    {
        $roundDetails = GameRound::getCurrentRoundDetailsForSession($sessionId);
        $deadUserIds = self::getDeadUserIdsForSession($sessionId);
        $aliveDoctors = self::where([
            ['session_id', '=', $sessionId],
            ['role', '=', DOCTOR_ROLE_ID]
        ])
            ->whereNotIn('user_id', $deadUserIds)
            ->get(['user_id'])
            ->toArray();
        $aliveDoctorUserIds = array_column($aliveDoctors, 'user_id');
        $doctorsWhoVoted = RoundDetailsDoctor::where([
            ['round_id', '=', $roundDetails['id']]
        ])->get(['saved_by'])->toArray();
        $doctorsWhoVotedUserIds = array_column($doctorsWhoVoted, 'saved_by');
        $doctorsWhoDidntVotedUserIds = array_diff($aliveDoctorUserIds, $doctorsWhoVotedUserIds);
        return User::whereIn('id', $doctorsWhoDidntVotedUserIds)->get(['name', 'email'])->toArray();
    }

    public static function getPendingSheriffsDataForCurrentRound($sessionId)
    {
        $roundDetails = GameRound::getCurrentRoundDetailsForSession($sessionId);
        $deadUserIds = self::getDeadUserIdsForSession($sessionId);
        $aliveSheriffs = self::where([
            ['session_id', '=', $sessionId],
            ['role', '=', SHERIFF_ROLE_ID]
        ])
            ->whereNotIn('user_id', $deadUserIds)
            ->get(['user_id'])
            ->toArray();
        $aliveSheriffUserIds = array_column($aliveSheriffs, 'user_id');
        $sheriffsWhoVoted = RoundDetailsSheriff::where([
            ['round_id', '=', $roundDetails['id']]
        ])->get(['asked_by'])->toArray();
        $sheriffsWhoVotedUserIds = array_column($sheriffsWhoVoted, 'asked_by');
        $sheriffsWhoDidntVotedUserIds = array_diff($aliveSheriffUserIds, $sheriffsWhoVotedUserIds);
        return User::whereIn('id', $sheriffsWhoDidntVotedUserIds)->get(['name', 'email'])->toArray();
    }

    public static function getKillVoteData($sessionId): array
    {
        $roundDetails = GameRound::getCurrentRoundDetailsForSession($sessionId);
        $roundId = $roundDetails['id'];
        $killVotes = GeneralVote::getKillVotesForUsers($roundId);
        $data = [];
        foreach ($killVotes as $killVote) {
            $datum = [];
            $datum['name'] = User::getUserDetails($killVote['kill_vote_to'])['name'];
            $datum['totalVotes'] = $killVote['total_votes'];
            $data[] = $datum;
        }
        return $data;
    }
}
