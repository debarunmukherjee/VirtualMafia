<?php

namespace App\Http\Controllers;

use App\Models\GameRound;
use App\Models\GeneralVote;
use App\Models\MafiaKill;
use App\Models\MafiaSession;
use App\Models\MafiaSessionInvite;
use App\Models\MafiaSessionMember;
use App\Models\RoundDetailsCommon;
use App\Models\RoundDetailsDoctor;
use App\Models\RoundDetailsMafia;
use App\Models\RoundDetailsSheriff;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MafiaSessionController extends Controller
{
    public function createMafiaSession(Request $request): RedirectResponse
    {
        $request->validate([
            'sessionName' => ['required', 'string'],
            'villagersCount' => ['required', 'numeric', 'gt:0'],
            'mafiasCount' => ['required', 'numeric', 'gt:0'],
            'sheriffsCount' => ['required', 'numeric', 'gt:0'],
            'doctorsCount' => ['required', 'numeric', 'gt:0'],
            'toBeInvitedPlayersList' => [
                function ($attribute, $value, $fail) {
                    $result = true;
                    foreach ($value as $email) {
                        $result = $result && $email['email'] !== Auth::user()->email && filter_var($email['email'], FILTER_VALIDATE_EMAIL);
                    }
                    if (!$result) {
                        $fail('Invalid invite email(s)');
                    }
                }
            ]
        ]);
        $sessionName = $request->post('sessionName');
        $slug = Str::slug($sessionName) . '-' . Str::random(32);
        $result = DB::transaction(function () use($sessionName, $slug, $request) {
            $mafiaSession = new MafiaSession();
            $mafiaSession->slug = $slug;
            $mafiaSession->name = $sessionName;
            $mafiaSession->villager_count = $request->post('villagersCount');
            $mafiaSession->mafia_count = $request->post('mafiasCount');
            $mafiaSession->sheriff_count = $request->post('sheriffsCount');
            $mafiaSession->doctor_count = $request->post('doctorsCount');
            $mafiaSession->is_started = false;
            return $mafiaSession->save() &&
                MafiaSessionInvite::sendSessionInvites($mafiaSession->id, array_column($request->post('toBeInvitedPlayersList'), 'email')) &&
                MafiaSessionMember::addMafiaSessionMember(Auth::id(), 'god', $mafiaSession->id);
        });

        if ($result) {
            return Redirect::route('session.lobby.index', ['slug' => $slug])->with('success', "Session $sessionName successfully created!");
        }

        return Redirect::back()->with('error', "Session creation failed!");
    }

    public function viewLobby($slug): Response
    {
        $sessionId = MafiaSession::getMafiaSessionIdFromSlug($slug);
        $sessionDetails = MafiaSession::getMafiaSessionDetails($sessionId);
        if (!$sessionDetails['is_started']) {
            $data = [
                'slug' => $slug,
                'invitedUsers' => MafiaSessionInvite::getSessionInvites($sessionId),
                'sessionDetails' => $sessionDetails,
                'isGod' => MafiaSessionMember::memberHasRole(Auth::id(), $sessionId, 'god')
            ];
        } elseif (!$sessionDetails['is_ended']) {
            $deadUserIds = MafiaSessionMember::getDeadUserIdsForSession($sessionId);
            if (in_array(Auth::id(), $deadUserIds)) {
                $data = [
                    'slug' => $slug,
                    'sessionDetails' => $sessionDetails,
                    'isUserDead' => true
                ];
            } else {
                $currentRound = GameRound::getCurrentRoundDetailsForSession($sessionId);
                if ($currentRound['time'] === 'Night') {
                    $gameMeta = [];
                    if (MafiaSessionMember::memberHasRole(Auth::id(), $sessionId, 'god')) {
                        $gameMeta['villagerAliveCount'] = MafiaSessionMember::getCountOfAliveVillagers($sessionId);
                        $gameMeta['mafiaAliveCount'] = MafiaSessionMember::getCountOfAliveMafias($sessionId);
                        $gameMeta['doctorsAliveCount'] = MafiaSessionMember::getCountOfAliveDoctors($sessionId);
                        $gameMeta['sheriffsAliveCount'] = MafiaSessionMember::getCountOfAliveSheriffs($sessionId);
                        $gameMeta['progress'] = GameRound::getProgressOfGodForCurrentNightRound($sessionId);
                        $gameMeta['pendingDoctors'] = MafiaSessionMember::getPendingDoctorsDataForCurrentRound($sessionId);
                        $gameMeta['pendingSheriffs'] = MafiaSessionMember::getPendingSheriffsDataForCurrentRound($sessionId);
                    } elseif (MafiaSessionMember::memberHasRole(Auth::id(), $sessionId, 'mafia')) {
                        $gameMeta['mafiaAliveCount'] = MafiaSessionMember::getCountOfAliveMafias($sessionId);
                        $gameMeta['totalAliveCount'] = MafiaSessionMember::getCountOfAlivePeople($sessionId);
                    } else {
                        $gameMeta['totalAliveCount'] = MafiaSessionMember::getCountOfAlivePeople($sessionId);
                    }
                    $gameMeta['aliveUserData'] = MafiaSessionMember::getAlivePeopleData($sessionId);
                    $data = [
                        'slug' => $slug,
                        'roundNumber' => $currentRound['number'],
                        'sessionDetails' => $sessionDetails,
                        'gameTime' => $currentRound['time'],
                        'role' => MafiaSessionMember::getRoleFromRoleId(MafiaSessionMember::getRoleIdOfMember($sessionId, Auth::id())),
                        'gameMeta' => $gameMeta
                    ];
                } else {
                    $lastRoundId = GameRound::where('session_id', $sessionId)->orderBy('id', 'DESC')->get()->toArray()[1]['id'];
                    $userIdKilledByMafia = RoundDetailsMafia::where('round_id', $lastRoundId)->first()->killed_user;
                    $userIdsSavedByDoctors = array_column(RoundDetailsDoctor::where('round_id', $lastRoundId)->get(['saved_user'])->toArray(), 'saved_user');
                    $gameMeta = [];
                    if (in_array($userIdKilledByMafia, $userIdsSavedByDoctors)) {
                        $gameMeta['nightResult'] = ['status' => 'Saved'];
                    } else {
                        $gameMeta['nightResult'] = ['status' => 'Killed', 'name' => User::getUserDetails($userIdKilledByMafia)['name']];
                    }
                    if (MafiaSessionMember::memberHasRole(Auth::id(), $sessionId, 'god')) {
                        $gameMeta['villagerAliveCount'] = MafiaSessionMember::getCountOfAliveVillagers($sessionId);
                        $gameMeta['mafiaAliveCount'] = MafiaSessionMember::getCountOfAliveMafias($sessionId);
                        $gameMeta['doctorsAliveCount'] = MafiaSessionMember::getCountOfAliveDoctors($sessionId);
                        $gameMeta['sheriffsAliveCount'] = MafiaSessionMember::getCountOfAliveSheriffs($sessionId);
                    } elseif (MafiaSessionMember::memberHasRole(Auth::id(), $sessionId, 'mafia')) {
                        $gameMeta['mafiaAliveCount'] = MafiaSessionMember::getCountOfAliveMafias($sessionId);
                        $gameMeta['totalAliveCount'] = MafiaSessionMember::getCountOfAlivePeople($sessionId);
                    } else {
                        $gameMeta['totalAliveCount'] = MafiaSessionMember::getCountOfAlivePeople($sessionId);
                    }
                    $gameMeta['aliveUserData'] = MafiaSessionMember::getAlivePeopleData($sessionId);
                    $gameMeta['killVoteData'] = MafiaSessionMember::getKillVoteData($sessionId);
                    $data = [
                        'slug' => $slug,
                        'roundNumber' => $currentRound['number'],
                        'sessionDetails' => $sessionDetails,
                        'gameTime' => $currentRound['time'],
                        'role' => MafiaSessionMember::getRoleFromRoleId(MafiaSessionMember::getRoleIdOfMember($sessionId, Auth::id())),
                        'gameMeta' => $gameMeta
                    ];
                }
            }
        } else {
            $gameEnded = MafiaSession::checkIfGameEnded($sessionId);
            $data = ['winner' => $gameEnded['winner'], 'sessionDetails' => $sessionDetails];
        }
        return Inertia::render('GameLobby', $data);
    }

    public function getOngoingGames(): Response
    {
        return Inertia::render('OngoingGames', [
            'ongoingGames' => MafiaSession::getOngoingGamesData(Auth::id())
        ]);
    }

    public function startGame(Request $request): RedirectResponse
    {
        $sessionId = MafiaSession::getMafiaSessionIdFromSlug($request->post('slug'));
        if (MafiaSession::startMafiaGameSession($sessionId)) {
            return Redirect::back()->with('success', "Game has begun!");
        }
        return Redirect::back()->with('error', "Failed to start game.");
    }

    public function performMafiaKill(Request $request): RedirectResponse
    {
        $slug = $request->post('slug');
        $killedUserEmail = $request->post('killedUserEmail');
        $sessionId = MafiaSession::getMafiaSessionIdFromSlug($slug);
        $roundDetails = GameRound::getCurrentRoundDetailsForSession($sessionId);
        $killedUserId = User::getUserDetailsFromEmail($killedUserEmail)['id'];
        if (RoundDetailsMafia::markMafiaKill($roundDetails['id'], $killedUserId)) {
            return Redirect::back()->with('success', "Mafia response recorded");
        }
        return Redirect::back()->with('error', "Mafia response could not be recorded");
    }

    public function performDoctorSave(Request $request): RedirectResponse
    {
        $slug = $request->post('slug');
        $doctorEmail = $request->post('doctorEmail');
        $savedUserEmail = $request->post('savedUserEmail');
        $sessionId = MafiaSession::getMafiaSessionIdFromSlug($slug);
        $roundDetails = GameRound::getCurrentRoundDetailsForSession($sessionId);
        $doctorUserId = User::getUserDetailsFromEmail($doctorEmail)['id'];
        $savedUserId = User::getUserDetailsFromEmail($savedUserEmail)['id'];
        if (RoundDetailsDoctor::recordDoctorResponse($roundDetails['id'], $doctorUserId, $savedUserId)) {
            return Redirect::back()->with('success', "Doctor response recorded");
        }
        return Redirect::back()->with('error', "Doctor response could not be recorded");
    }

    public function performSheriffFind(Request $request): RedirectResponse
    {
        $slug = $request->post('slug');
        $sheriffEmail = $request->post('sheriffEmail');
        $askedUserEmail = $request->post('askedUserEmail');
        $sessionId = MafiaSession::getMafiaSessionIdFromSlug($slug);
        $roundDetails = GameRound::getCurrentRoundDetailsForSession($sessionId);
        $sheriffUserId = User::getUserDetailsFromEmail($sheriffEmail)['id'];
        $askedUserId = User::getUserDetailsFromEmail($askedUserEmail)['id'];
        $result = MafiaSessionMember::memberHasRole($askedUserId, $sessionId, 'mafia');
        if (RoundDetailsSheriff::recordSheriffResponse($roundDetails['id'], $askedUserId, $sheriffUserId, $result)) {
            return Redirect::back()->with('success', $result ? "The chosen person is a Mafia" : "The chosen person is not a Mafia");
        }
        return Redirect::back()->with('error', "Sheriff response could not be recorded");
    }

    public function declareMorning(Request $request): RedirectResponse
    {
        $result = DB::transaction(function () use ($request) {
            $slug = $request->post('slug');
            $sessionId = MafiaSession::getMafiaSessionIdFromSlug($slug);
            $lastRound = GameRound::getCurrentRoundDetailsForSession($sessionId);
            $userIdKilledByMafia = RoundDetailsMafia::where('round_id', $lastRound['id'])->first()->killed_user;
            $userIdsSavedByDoctors = array_column(RoundDetailsDoctor::where('round_id', $lastRound['id'])->get(['saved_user'])->toArray(), 'saved_user');
            $result = true;
            if (!in_array($userIdKilledByMafia, $userIdsSavedByDoctors)) {
                $record = new MafiaKill();
                $record->round_id = $lastRound['id'];
                $record->killed_user = $userIdKilledByMafia;
                $result = $record->save();
            }
            $result = $result && GameRound::createSessionRound($sessionId, 'Day');
            $gameEnded = MafiaSession::checkIfGameEnded($sessionId);
            if ($gameEnded['isEnded']) {
                $record = MafiaSession::where('id', $sessionId)->first();
                $record->is_ended = 1;
                $result = $result && $record->save();
            }
            $gameEnded = MafiaSession::checkIfGameEnded($sessionId);
            if ($gameEnded['isEnded']) {
                $record = MafiaSession::where('id', $sessionId)->first();
                $record->is_ended = 1;
                $result = $result && $record->save();
            }
            return $result;
        });

        if ($result) {
            return Redirect::back()->with('success', "Morning has arrived!");
        }
        return Redirect::back()->with('error', "Some error occurred!");
    }

    public function recordVoteKill(Request $request): RedirectResponse
    {
        $result = DB::transaction(function () use ($request) {
            $slug = $request->post('slug');
            $voteKilledUserEmail = $request->post('voteKilledUserEmail');
            $sessionId = MafiaSession::getMafiaSessionIdFromSlug($slug);
            $roundDetails = GameRound::getCurrentRoundDetailsForSession($sessionId);
            GeneralVote::where([
                ['round_id', '=', $roundDetails['id']],
                ['kill_vote_by', '=', Auth::id()],
            ])->delete();
            $record = new GeneralVote();
            $record->round_id = $roundDetails['id'];
            $record->kill_vote_by = Auth::id();
            $record->kill_vote_to = User::getUserDetailsFromEmail($voteKilledUserEmail)['id'];
            return $record->save();
        });

        if ($result) {
            return Redirect::back()->with('success', "Vote has been cast!");
        }
        return Redirect::back()->with('error', "Some error occurred!");
    }

    public function declareNight(Request $request)
    {
        [$result, $killedId] = DB::transaction(function () use ($request) {
            $slug = $request->post('slug');
            $sessionId = MafiaSession::getMafiaSessionIdFromSlug($slug);
            $lastRound = GameRound::getCurrentRoundDetailsForSession($sessionId);
            $votesData = GeneralVote::getKillVotesForUsers($lastRound['id']);
            $record = new RoundDetailsCommon();
            $record->round_id = $lastRound['id'];
            $record->killed_user = $votesData[0]['kill_vote_to'];
            $result = $record->save();
            $result = $result && GameRound::createSessionRound($sessionId, 'Night');
            $gameEnded = MafiaSession::checkIfGameEnded($sessionId);
            if ($gameEnded['isEnded']) {
                $record = MafiaSession::where('id', $sessionId)->first();
                $record->is_ended = 1;
                $result = $result && $record->save();
            }
            return [$result, $votesData[0]['kill_vote_to']];
        });

        if ($result) {
            $userName = User::getUserDetails($killedId)['name'];
            return Redirect::back()->with('success', "Night has arrived and $userName is no more!");
        }
        return Redirect::back()->with('error', "Some error occurred!");
    }
}
