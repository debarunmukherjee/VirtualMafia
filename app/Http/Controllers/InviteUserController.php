<?php

namespace App\Http\Controllers;

use App\Models\MafiaSession;
use App\Models\MafiaSessionInvite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class InviteUserController extends Controller
{
    public function createInvite(Request $request): RedirectResponse
    {
        $request->validate([
            'slug' => ['string', 'required'],
            'email' => ['email', 'required']
        ]);
        $mafiaSessionSlug = $request->post('slug');
        $sessionId = MafiaSession::getMafiaSessionIdFromSlug($mafiaSessionSlug);
        if (MafiaSessionInvite::sendSessionInvites($sessionId, [$request->post('email')])) {
            return Redirect::back()->with('success', "Invite Sent!");
        }
        return Redirect::back()->with('error', "Failed to send invite.");
    }

    public function acceptInvite(Request $request): RedirectResponse
    {
        $request->validate([
            'slug' => [
                'string',
                'required'
            ]
        ]);
        $slug = $request->post('slug');
        $sessionId = MafiaSession::getMafiaSessionIdFromSlug($slug);
        if (MafiaSession::isSessionStarted($sessionId)) {
            return Redirect::back()->with('error', 'The game has already begun or expired.');
        }
        if (!MafiaSession::canAddMembersToSession($sessionId)) {
            return Redirect::back()->with('error', 'The game is full!');
        }
        MafiaSessionInvite::markMafiaSessionInviteAccepted(
            $sessionId,
            Auth::user()->email
        );
        return Redirect::route('session.lobby.index', ['slug' => $slug])->with('success', "Welcome to the game lobby!");
    }

    public function rejectInvite(Request $request): RedirectResponse
    {
        $request->validate([
            'slug' => ['string', 'required']
        ]);
        MafiaSessionInvite::markMafiaSessionInviteRejected(
            MafiaSession::getMafiaSessionIdFromSlug($request->post('slug')),
            Auth::user()->email
        );
        return Redirect::back()->with('success', 'The invite has been rejected');
    }

    public function getInvites(): Response
    {
        return Inertia::render('UserInvites', [
            'invitesList' => MafiaSessionInvite::getUserInvites(Auth::user()->email)
        ]);
    }
}
