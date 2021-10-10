import React, {useContext, useEffect, useState} from 'react';
import Authenticated from '@/Layouts/Authenticated';
import {Head, usePage} from '@inertiajs/inertia-react';
import UserInviteList from "@/Components/UserInviteList";
import Button from "@/Components/Button";
import NumberInput from "@/Components/NumberInput";
import {Inertia} from "@inertiajs/inertia";
import {validateEmail} from "@/Utils/Common";

export default function HostGame(props) {
    const [villagersCount, setVillagersCount] = useState(1);
    const [villagersCountError, setVillagersCountError] = useState('');
    const [mafiasCount, setMafiasCount] = useState(1);
    const [mafiasCountError, setMafiasCountError] = useState('');
    const [sheriffsCount, setSheriffsCount] = useState(1);
    const [sheriffsCountError, setSheriffsCountError] = useState('');
    const [doctorsCount, setDoctorsCount] = useState(1);
    const [doctorsCountError, setDoctorsCountError] = useState('');
    const [sessionName, setSessionName] = useState('');
    const [sessionNameError, setSessionNameError] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteEmailError, setInviteEmailError] = useState('');
    const [toBeInvitedPlayersList, setToBeInvitedPlayersList] = useState([]);

    const { errors } = usePage().props;

    useEffect(() => {
        errors.villagersCount ? setVillagersCountError(errors.villagersCount) : setVillagersCountError('');
        errors.mafiasCount ? setMafiasCountError(errors.mafiasCount) : setMafiasCountError('');
        errors.sheriffsCount ? setSheriffsCountError(errors.sheriffsCount) : setSheriffsCountError('');
        errors.doctorsCount ? setDoctorsCountError(errors.doctorsCount) : setDoctorsCountError('');
        errors.sessionName ? setSessionNameError(errors.sessionName) : setSessionNameError('');
    },[errors]);

    const handleHostSession = () => {
        Inertia.post(
            '/host-mafia-session',
            {
                villagersCount: villagersCount,
                mafiasCount: mafiasCount,
                sheriffsCount: sheriffsCount,
                doctorsCount: doctorsCount,
                sessionName: sessionName,
                toBeInvitedPlayersList: toBeInvitedPlayersList,
            }
        );
    }

    const addUserToBeInvited = () => {
        if (!validateEmail(inviteEmail)) {
            setInviteEmailError('Invalid email format.');
            return;
        }
        setToBeInvitedPlayersList([
            ...toBeInvitedPlayersList,
            {
                status: 'Pending',
                email: inviteEmail,
            }
        ]);
        setInviteEmail('');
        setInviteEmailError('');
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    <img src="/storage/images/magic-wand.png" alt="Host Virtual Mafia Session Image" style={{width: '2rem'}} className="inline-block mr-2 align-bottom"/>
                    Host A Mafia Session
                </h2>
            }
        >
            <Head title="Host Mafia Session" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="w-full p-3">
                                    <p className="text-xl">
                                        Choose Number Of Players In Each Of The Roles:
                                    </p>
                                    <hr className="w-1/2 mt-3"/>
                                    <ul className="md:ml-12 mb-10">
                                        <li className="mt-4 xs:flex xs:flex-row flex-col">
                                            <div className="md:w-2/12 flex items-center font-extrabold align-middle">
                                                <span>Villagers:</span>
                                            </div>
                                            <div className="md:w-10/12 inline-block xs:pl-8">
                                                <NumberInput
                                                    elementId="villagers_count"
                                                    value={villagersCount}
                                                    setValue={setVillagersCount}
                                                />
                                                {villagersCountError ? (<p className="text-red-500 text-xs mt-1">{villagersCountError}</p>) : ''}
                                            </div>
                                        </li>
                                        <li className="mt-4 xs:flex xs:flex-row flex-col">
                                            <div className="md:w-2/12 flex items-center font-extrabold align-middle">
                                                <span>Mafias:</span>
                                            </div>
                                            <div className="md:w-10/12 inline-block xs:pl-8">
                                                <NumberInput
                                                    elementId="mafias_count"
                                                    value={mafiasCount}
                                                    setValue={setMafiasCount}
                                                />
                                                {mafiasCountError ? (<p className="text-red-500 text-xs mt-1">{mafiasCountError}</p>) : ''}
                                            </div>
                                        </li>
                                        <li className="mt-4 xs:flex xs:flex-row flex-col">
                                            <div className="md:w-2/12 flex items-center font-extrabold align-middle">
                                                <span>Sheriff:</span>
                                            </div>
                                            <div className="md:w-10/12 inline-block xs:pl-8">
                                                <NumberInput
                                                    elementId="sheriffs_count"
                                                    value={sheriffsCount}
                                                    setValue={setSheriffsCount}
                                                />
                                                {sheriffsCountError ? (<p className="text-red-500 text-xs mt-1">{sheriffsCountError}</p>) : ''}
                                            </div>
                                        </li>
                                        <li className="mt-4 xs:flex xs:flex-row flex-col">
                                            <div className="md:w-2/12 flex items-center font-extrabold align-middle">
                                                <span>Doctor:</span>
                                            </div>
                                            <div className="md:w-10/12 inline-block xs:pl-8">
                                                <NumberInput
                                                    elementId="doctors_count"
                                                    value={doctorsCount}
                                                    setValue={setDoctorsCount}
                                                />
                                                {doctorsCountError ? (<p className="text-red-500 text-xs mt-1">{doctorsCountError}</p>) : ''}
                                            </div>
                                        </li>
                                    </ul>
                                    <p className="text-xl">Session Name</p>
                                    <hr className="w-1/2 mt-3"/>
                                    <div className="flex flex-row mt-4 mb-6">
                                        <div className="flex-grow">
                                            <input
                                                type="text"
                                                placeholder="Friday Night Mafia"
                                                className="w-full rounded-md border-gray-300"
                                                value={sessionName}
                                                onChange={(e) => {
                                                    setSessionName(e.target.value);
                                                }}
                                            />
                                            {sessionNameError ? (<p className="text-red-500 text-xs mt-1">{sessionNameError}</p>) : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full p-3 md:mt-0">
                                    <div className="md:ml-16">
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
                                        <p className="text-xl">Players</p>
                                        <hr className="w-1/2 mt-3"/>
                                        <UserInviteList userList={toBeInvitedPlayersList}/>
                                    </div>
                                </div>
                            </div>
                            <Button className="mt-6 bg-blue-500 hover:bg-blue-600 text white" onClick={handleHostSession}>
                                Create Session
                                <span className="inline-block ml-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
