<?php

use App\Http\Controllers\InviteUserController;
use App\Http\Controllers\MafiaSessionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('HostGame');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/host-mafia-session', [MafiaSessionController::class, 'createMafiaSession']);
    Route::post('/invite/user', [InviteUserController::class, 'createInvite'])->middleware(['god.access']);
    Route::post('/session/start-game', [MafiaSessionController::class, 'startGame'])->middleware(['god.access']);
    Route::post('/session/mafia-kill', [MafiaSessionController::class, 'performMafiaKill'])->middleware(['god.access']);
    Route::post('/session/doctor-save', [MafiaSessionController::class, 'performDoctorSave'])->middleware(['god.access']);
    Route::post('/session/sheriff-find', [MafiaSessionController::class, 'performSheriffFind'])->middleware(['god.access']);
    Route::post('/session/declare-morning', [MafiaSessionController::class, 'declareMorning'])->middleware(['god.access']);
    Route::post('/session/declare-night', [MafiaSessionController::class, 'declareNight'])->middleware(['god.access']);
    Route::put('/invite/accept', [InviteUserController::class, 'acceptInvite']);
    Route::put('/invite/reject', [InviteUserController::class, 'rejectInvite']);
    Route::get('/invites', [InviteUserController::class, 'getInvites'])->name('invites');
    Route::get('/ongoing-games', [MafiaSessionController::class, 'getOngoingGames'])->name('ongoing.games');
    Route::get('/lobby/{slug}', [MafiaSessionController::class, 'viewLobby'])->middleware(['mafia.session'])->name('session.lobby.index');
    Route::post('/session/vote-kill', [MafiaSessionController::class, 'recordVoteKill']);
});

require __DIR__.'/auth.php';
