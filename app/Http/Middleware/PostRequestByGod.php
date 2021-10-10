<?php

namespace App\Http\Middleware;

use App\Models\MafiaSession;
use App\Models\MafiaSessionMember;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostRequestByGod
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
        $mafiaSessionSlug = $request->post('slug');
        $sessionId = MafiaSession::getMafiaSessionIdFromSlug($mafiaSessionSlug);
        if (empty($sessionId) || (!MafiaSessionMember::memberHasRole(Auth::id(), $sessionId, 'god'))) {
            abort('403', 'Access Denied.');
        }
        return $next($request);
    }
}
