<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MafiaSessionInvite extends Model
{
    use HasFactory;
    protected $fillable = [
        'email',
        'session_id',
        'status'
    ];

    public static function isMafiaSessionMember($mafiaSessionId, $email): bool
    {
        $invite = self::where([
            ['session_id', '=', $mafiaSessionId],
            ['email', '=', $email]
        ])->first();
        return !empty($invite) && (int)$invite->status === 1;
    }

    public static function sendSessionInvites($mafiaSessionId, $emailIdList): bool
    {
        $records = [];
        foreach ($emailIdList as $email) {
            $record = [];
            $record['email'] = $email;
            $record['session_id'] = $mafiaSessionId;
            $record['status'] = 0;
            $records[] = $record;
        }
        return self::insertOrIgnore($records);
    }

    public static function getSessionInvites($mafiaSessionId): array
    {
        $invites = self::where('session_id', $mafiaSessionId)->get()->toArray();
        $result = [];
        foreach ($invites as $invite) {
            if ((int)$invite['status'] === 1) {
                $item['status'] = 'Accepted';
            } elseif ((int)$invite['status'] === 2) {
                $item['status'] = 'Rejected';
            } else {
                $item['status'] = 'Pending';
            }
            $item['email'] = $invite['email'];
            if ($item['status'] === 'Accepted') {
                $item['fullname'] = User::getUserDetailsFromEmail($invite['email'])['name'];
            }

            $result[] = $item;
        }

        return $result;
    }

    public static function markMafiaSessionInviteAccepted($sessionId, $email): void
    {
        self::where([
            ['session_id', $sessionId],
            ['email', $email]
        ])->update(['status' => 1]);
    }

    public static function markMafiaSessionInviteRejected($sessionId, $email): void
    {
        self::where([
            ['session_id', $sessionId],
            ['email', $email]
        ])->update(['status' => 2]);
    }

    public static function getUserInvites($email)
    {
        return self::join('mafia_session_members', 'mafia_session_members.session_id', '=', 'mafia_session_invites.session_id')
            ->join('mafia_sessions', 'mafia_sessions.id', '=', 'mafia_session_invites.session_id')
            ->join('users', 'users.id', '=', 'mafia_session_members.user_id')
            ->where([
            ['mafia_session_invites.email', '=', $email],
            ['status', '=', 0],
            ['role', '=', 0]
        ])->get(['mafia_sessions.name as sessionName', 'users.email as godEmail', 'users.name as godName', 'mafia_sessions.slug as slug'])->toArray();
    }

    public static function getConfirmedPlayersForSession($sessionId)
    {
        return self::where([
            ['session_id', '=', $sessionId],
            ['status', '=', 1]
        ])->get(['email'])->toArray();
    }
}
