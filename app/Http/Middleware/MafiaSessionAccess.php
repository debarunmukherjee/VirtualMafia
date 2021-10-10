<?php

namespace App\Http\Middleware;

use App\Models\MafiaSession;
use App\Models\MafiaSessionInvite;
use App\Models\MafiaSessionMember;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MafiaSessionAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $mafiaSessionSlug = $request->segment(count($request->segments()));
        $sessionId = MafiaSession::getMafiaSessionIdFromSlug($mafiaSessionSlug);
        if (empty($sessionId) || (!MafiaSessionMember::memberHasRole(Auth::id(), $sessionId, 'god') && !MafiaSessionInvite::isMafiaSessionMember($sessionId, Auth::user()->email))) {
            abort('404', 'Mafia Session Not Found.');
        }
        return $next($request);
    }
}
