import React, {useState} from 'react';
import {usePage} from "@inertiajs/inertia-react";
import {validateEmail} from "@/Utils/Common";
import {Inertia} from "@inertiajs/inertia";
import UserInviteList from "@/Components/UserInviteList";
import Button from "@/Components/Button";

export default function PreStart() {
    const { slug, invitedUsers, sessionDetails, isGod } = usePage().props;
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteEmailError, setInviteEmailError] = useState('');

    const addUserToBeInvited = () => {
        if (!validateEmail(inviteEmail)) {
            setInviteEmailError('Invalid email format.');
            return;
        }

        Inertia.post('/invite/user', {
            email: inviteEmail,
            slug: slug
        })

        setInviteEmail('');
        setInviteEmailError('');
    }

    const getTotalRequiredPlayers = () => {
        return Number(sessionDetails.villager_count ? sessionDetails.villager_count : 0) +
            Number(sessionDetails.mafia_count ? sessionDetails.mafia_count : 0) +
            Number(sessionDetails.sheriff_count ? sessionDetails.sheriff_count : 0) +
            Number(sessionDetails.doctor_count ? sessionDetails.doctor_count : 0);
    }

    const getTotalConfirmedPlayers = () => {
        return invitedUsers ? invitedUsers.filter((player) => player.status === 'Accepted').length : 0;
    }

    const startGame = () => {
        Inertia.post('/session/start-game', {
            slug: slug
        })
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="w-full p-3">
                    <p className="text-xl">
                        Number Of Players In Each Role:
                    </p>
                    <hr className="w-1/2 mt-3"/>
                    <ul className="md:ml-12 mb-10">
                        <li className="mt-4 xs:flex xs:flex-row flex-col">
                            <div className="md:w-2/12 flex items-center font-extrabold align-middle">
                                <span>Villagers:</span>
                            </div>
                            <div className="md:w-10/12 inline-block xs:pl-8 text-bold">
                                {sessionDetails.villager_count}
                            </div>
                        </li>
                        <li className="mt-4 xs:flex xs:flex-row flex-col">
                            <div className="md:w-2/12 flex items-center font-extrabold align-middle">
                                <span>Mafias:</span>
                            </div>
                            <div className="md:w-10/12 inline-block xs:pl-8">
                                {sessionDetails.mafia_count}
                            </div>
                        </li>
                        <li className="mt-4 xs:flex xs:flex-row flex-col">
                            <div className="md:w-2/12 flex items-center font-extrabold align-middle">
                                <span>Sheriff:</span>
                            </div>
                            <div className="md:w-10/12 inline-block xs:pl-8">
                                {sessionDetails.sheriff_count}
                            </div>
                        </li>
                        <li className="mt-4 xs:flex xs:flex-row flex-col">
                            <div className="md:w-2/12 flex items-center font-extrabold align-middle">
                                <span>Doctor:</span>
                            </div>
                            <div className="md:w-10/12 inline-block xs:pl-8">
                                {sessionDetails.doctor_count}
                            </div>
                        </li>
                    </ul>
                    <hr className="md:ml-12 mb-6 w-1/2 bg-gray-300 h-0.5"/>
                    <ul className="md:ml-12 mb-10">
                        <li className="mt-4 xs:flex xs:flex-row flex-col">
                            <div className="flex items-center font-extrabold align-middle">
                                <span>Total Required Players:</span>
                            </div>
                            <div className="inline-block xs:pl-8">
                                {getTotalRequiredPlayers()}
                            </div>
                        </li>
                        <li className="mt-4 xs:flex xs:flex-row flex-col">
                            <div className="flex items-center font-extrabold align-middle">
                                <span>Confirmed Players:</span>
                            </div>
                            <div className="inline-block xs:pl-8">
                                {getTotalConfirmedPlayers()}
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="w-full p-3 md:mt-0">
                    <div className="md:ml-16">
                        {isGod ? (
                            <>
                                <p className="text-xl">Invite Friends To This Session</p>
                                <hr className="w-1/2 mt-3"/>
                                <div className="mt-4 mb-10">
                                    <div className="flex flex-row">
                                        <div className="flex-grow">
                                            <input
                                                type="email"
                                                placeholder="abc@example.com"
                                                className="w-full rounded-md border-gray-300"
                                                onChange={(e) => {
                                                    setInviteEmail(e.target.value);
                                                }}
                                                value={inviteEmail}
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <svg onClick={addUserToBeInvited} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-3 inline-block cursor-pointer text-blue-400 hover:text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        {inviteEmailError ? (<p className="text-red-500 text-xs mt-1">{inviteEmailError}</p>) : ''}
                                    </div>
                                </div>
                            </>
                        ) : ''}
                        <p className="text-xl">Players</p>
                        <hr className="w-1/2 mt-3"/>
                        <UserInviteList userList={invitedUsers}/>
                    </div>
                </div>
            </div>
            <Button className="mt-6 bg-blue-500 hover:bg-blue-600 text white" onClick={startGame} processing={getTotalConfirmedPlayers() !== getTotalRequiredPlayers()}>
                Start Game
                <span className="inline-block ml-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </span>
            </Button>
        </div>
    );
}
