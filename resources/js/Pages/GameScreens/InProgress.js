import React, {useEffect, useState} from "react";
import {usePage} from "@inertiajs/inertia-react";
import AutocompleteSelect from "@/Components/AutocompleteSelect";
import Button from "@/Components/Button";
import {Inertia} from "@inertiajs/inertia";
import {Alert} from "@material-ui/lab";

export default function InProgress() {
    const {roundNumber, gameTime, role, gameMeta, slug} = usePage().props;
    const [selectedUsersForDoctors, setSelectedUsersForDoctors] = useState();
    const [selectedUsersForSheriffs, setSelectedUsersForSheriffs] = useState();
    const [selectedUserForMafias, setSelectedUserForMafias] = useState();
    const [selectedUserToVoteKill, setSelectedUserToVoteKill] = useState();

    useEffect(() => {
        const data = {};
        gameMeta.pendingDoctors && gameMeta.pendingDoctors.forEach((doc) => {
            data[doc.email] = gameMeta.aliveUserData[0];
        });
        setSelectedUsersForDoctors(data);
    }, [gameMeta.pendingDoctors]);

    useEffect(() => {
        const data = {};
        gameMeta.pendingSheriffs && gameMeta.pendingSheriffs.forEach((sheriff) => {
            data[sheriff.email] = gameMeta.aliveUserData[0];
        });
        setSelectedUsersForSheriffs(data);
    }, [gameMeta.pendingSheriffs]);

    useEffect(() => {
        setSelectedUserForMafias(gameMeta.aliveUserData[0]);
        setSelectedUserToVoteKill(gameMeta.aliveUserData[0]);
    }, [gameMeta.aliveUserData]);


    const getHeaderContentForMafia = () => {
        return (
            <div className="p-4 border">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="w-full p-3 text-center">
                        Number of Mafia's left: <span className="font-extrabold">{gameMeta.mafiaAliveCount}</span>
                    </div>
                    <div className="w-full p-3 md:mt-0 text-center">
                        Number of people left: <span className="font-extrabold">{gameMeta.totalAliveCount}</span>
                    </div>
                </div>
            </div>
        );
    }

    const getHeaderContentForNonMafia = () => {
        return (
            <div className="p-4 border">
                <div className="w-full p-3 text-center">
                    Number of people alive: <span className="font-extrabold">{gameMeta.totalAliveCount}</span>
                </div>
            </div>
        );
    }

    const getHeaderContentForGod = () => {
        return (
            <div className="p-4 border">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="w-full p-3 text-center">
                        Number of Villagers left: <span className="font-extrabold">{gameMeta.villagerAliveCount}</span>
                    </div>
                    <div className="w-full p-3 md:mt-0 text-center">
                        Number of Mafia's left: <span className="font-extrabold">{gameMeta.mafiaAliveCount}</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="w-full p-3 text-center">
                        Number of Sheriffs left: <span className="font-extrabold">{gameMeta.sheriffsAliveCount}</span>
                    </div>
                    <div className="w-full p-3 md:mt-0 text-center">
                        Number of Doctors left: <span className="font-extrabold">{gameMeta.doctorsAliveCount}</span>
                    </div>
                </div>
            </div>
        );
    }

    const getInProgressHeaderContent = () => {
        switch (role) {
            case 'mafia':
                return getHeaderContentForMafia();
            case 'doctor':
            case 'sheriff':
            case 'villager':
                return getHeaderContentForNonMafia();
            case 'god':
                return getHeaderContentForGod();
        }
    }

    const getInProgressContentForMafia = () => {
        return (
            <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="w-full p-3 text-center">
                        <img src="/storage/images/evil.png" alt="Evil Mafia Image" className="inline-block mr-2 align-bottom w-1/2"/>
                        <p className="mt-6">Discuss and let the <b>God</b> know about the person you plan to kill. When done, go to sleep and find out the results in the morning.</p>
                    </div>
                    <div className="w-full p-3 md:mt-0">
                        <div className="rounded p-3 border">
                            <p className="text-xl font-extrabold border-b text-center">Activity Logs</p>
                            <p className="mt-4">Coming Soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getInProgressContentForDoctor = () => {
        return (
            <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="w-full p-3 text-center">
                        <img src="/storage/images/doctor.png" alt="Doctor Image" className="inline-block mr-2 align-bottom w-1/2"/>
                        <p className="mt-6">Tell <b>God</b> about the person you plan to save. When done, go to sleep and find out the results in the morning.</p>
                    </div>
                    <div className="w-full p-3 md:mt-0">
                        <div className="rounded p-3 border">
                            <p className="text-xl font-extrabold border-b text-center">Activity Logs</p>
                            <p className="mt-4">Coming Soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getInProgressContentForSheriff = () => {
        return (
            <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="w-full p-3 text-center">
                        <img src="/storage/images/detective.png" alt="Detective Image" className="inline-block mr-2 align-bottom w-1/2"/>
                        <p className="mt-6">Ask <b>God</b> about the person you think is a mafia. God will reply with a <b>Yes</b> or <b>No</b>. Then go to sleep and use your knowledge to save the villagers in the morning.</p>
                    </div>
                    <div className="w-full p-3 md:mt-0">
                        <div className="rounded p-3 border">
                            <p className="text-xl font-extrabold border-b text-center">Activity Logs</p>
                            <p className="mt-4">Coming Soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getGodProgressInNight = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="mx-auto p-3">
                    <p className={`rounded ${gameMeta.progress.mafia === 'done' ? 'bg-green-500' : 'bg-blue-500'} p-4 text-center text-white w-56 md:w-auto`}>
                        Connect With Mafias
                        {gameMeta.progress.mafia === 'done' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : ''}
                    </p>
                </div>
                <div className="mx-auto p-3">
                    <p className={`rounded ${gameMeta.progress.doctor === 'done' ? 'bg-green-500' : gameMeta.progress.doctor === 'current' ? 'bg-blue-500' : 'bg-gray-300'} p-4 text-center ${gameMeta.progress.doctor === 'future' ? 'text-black' : 'text-white'} w-56 md:w-auto`}>
                        Connect With Doctors
                        {gameMeta.progress.doctor === 'done' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : ''}
                    </p>
                </div>
                <div className="mx-auto p-3">
                    <p className={`rounded ${gameMeta.progress.sheriff === 'done' ? 'bg-green-500' : gameMeta.progress.sheriff === 'current' ? 'bg-blue-500' : 'bg-gray-300'} p-4 text-center ${gameMeta.progress.sheriff === 'future' ? 'text-black' : 'text-white'} w-56 md:w-auto`}>
                        Connect With Sheriffs
                        {gameMeta.progress.sheriff === 'done' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : ''}
                    </p>
                </div>
            </div>
        );
    }

    const makeRequestToPerformDoctorAction = (doctorEmail) => {
        Inertia.post(
            '/session/doctor-save',
            {
                slug: slug,
                doctorEmail: doctorEmail,
                savedUserEmail: selectedUsersForDoctors[doctorEmail].email,
            }
        );
    }
    const getInProgressContentForGodAndDoctor = () => {
        return (
            <div className="mt-8">
                {getGodProgressInNight()}
                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="w-full p-3 text-center">
                            <p className="text-2xl font-extrabold border-b pb-3">Doctor Actions</p>
                            <ul>
                                {gameMeta.pendingDoctors && gameMeta.pendingDoctors.map((doctor) => {
                                    return (
                                        <li className="border-b my-6 p-6" key={doctor.email}>
                                            <span className="text-xl">Doctor: <span className="font-bold">{doctor.name}</span></span>
                                            <div className="flex flex-col sm:flex-row">
                                                {selectedUsersForDoctors ? (
                                                    <AutocompleteSelect
                                                        itemsList={gameMeta.aliveUserData}
                                                        selectedValue={selectedUsersForDoctors[doctor.email]}
                                                        itemLabelKey="name"
                                                        setSelectedValue={(val) => {setSelectedUsersForDoctors({
                                                            ...selectedUsersForDoctors,
                                                            [doctor.email] : val
                                                        })}}
                                                        placeholder="Select person to save"
                                                        customClasses="w-full flex-grow"
                                                    />
                                                ) : ''}
                                                <Button className="ml-2 bg-blue-500 hover:bg-blue-600 text white text-center mt-2 sm:mt-0" onClick={() => {
                                                    makeRequestToPerformDoctorAction(doctor.email)
                                                }}>
                                                    <span className="inline-block mx-auto">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </span>
                                                </Button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="w-full p-3 md:mt-0">
                            <div className="rounded p-3 border">
                                <p className="text-xl font-extrabold border-b text-center">Activity Logs</p>
                                <p className="mt-4">Coming Soon...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const makeRequestToPerformSheriffAction = (sheriffEmail) => {
        Inertia.post(
            '/session/sheriff-find',
            {
                slug: slug,
                sheriffEmail: sheriffEmail,
                askedUserEmail: selectedUsersForSheriffs[sheriffEmail].email,
            }
        );
    }
    const getInProgressContentForGodAndSheriff = () => {
        return (
            <div className="mt-8">
                {getGodProgressInNight()}
                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="w-full p-3 text-center">
                            <p className="text-2xl font-extrabold border-b pb-3">Sheriff Actions</p>
                            <ul>
                                {gameMeta.pendingSheriffs && gameMeta.pendingSheriffs.map((sheriff) => {
                                    return (
                                        <li className="border-b my-6 p-6" key={sheriff.email}>
                                            <span className="text-xl">Sheriff: <span className="font-bold">{sheriff.name}</span></span>
                                            <div className="flex flex-col sm:flex-row">
                                                {selectedUsersForSheriffs ? (
                                                    <AutocompleteSelect
                                                        itemsList={gameMeta.aliveUserData}
                                                        selectedValue={selectedUsersForSheriffs[sheriff.email]}
                                                        itemLabelKey="name"
                                                        setSelectedValue={(val) => {setSelectedUsersForSheriffs({
                                                            ...selectedUsersForSheriffs,
                                                            [sheriff.email] : val
                                                        })}}
                                                        placeholder="Select person to investigate"
                                                        customClasses="w-full flex-grow"
                                                    />
                                                ) : ''}
                                                <Button className="ml-2 bg-blue-500 hover:bg-blue-600 text white text-center mt-2 sm:mt-0" onClick={() => {
                                                    makeRequestToPerformSheriffAction(sheriff.email)
                                                }}>
                                                    <span className="inline-block mx-auto">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </span>
                                                </Button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="w-full p-3 md:mt-0">
                            <div className="rounded p-3 border">
                                <p className="text-xl font-extrabold border-b text-center">Activity Logs</p>
                                <p className="mt-4">Coming Soon...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const makeRequestToPerformMafiaKill = () => {
        Inertia.post(
            '/session/mafia-kill',
            {
                slug: slug,
                killedUserEmail: selectedUserForMafias.email,
            }
        );
    }
    const getInProgressContentForGodAndMafia = () => {
        return (
            <div className="mt-8">
                {getGodProgressInNight()}
                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="w-full p-3 text-center">
                            <p className="text-2xl font-extrabold border-b pb-3">Mafia Actions</p>
                            <div className="my-6 p-6">
                                <div className="flex flex-col sm:flex-row">
                                    {selectedUserForMafias ? (
                                        <AutocompleteSelect
                                            itemsList={gameMeta.aliveUserData}
                                            selectedValue={selectedUserForMafias}
                                            itemLabelKey="name"
                                            setSelectedValue={(val) => {setSelectedUserForMafias(val)}}
                                            placeholder="Select person to kill"
                                            customClasses="w-full flex-grow"
                                        />
                                    ) : ''}
                                    <Button className="ml-2 bg-blue-500 hover:bg-blue-600 text white text-center mt-2 sm:mt-0" onClick={makeRequestToPerformMafiaKill}>
                                        <span className="inline-block mx-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full p-3 md:mt-0">
                            <div className="rounded p-3 border">
                                <p className="text-xl font-extrabold border-b text-center">Activity Logs</p>
                                <p className="mt-4">Coming Soon...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getInProgressContentForGod = () => {
        if (gameMeta.progress.mafia === 'current') {
            return getInProgressContentForGodAndMafia();
        } else if (gameMeta.progress.doctor === 'current') {
            return getInProgressContentForGodAndDoctor();
        } else {
            return getInProgressContentForGodAndSheriff();
        }
    }

    const getDayScreenForGod = () => {
        return (
            <div>
                <p className="my-4 text-2xl">Vote Kill Data</p>
                {gameMeta.killVoteData.length > 0 ? (
                    <div className="rounded p-3 border">
                        <ul>
                            {gameMeta.killVoteData.map((vote) => {
                                return (
                                    <li className="border p-3 m-3 text-center" key={vote.name}>
                                        {vote.name} : <span className="font-extrabold">{vote.totalVotes}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (<Alert severity="info">No one has cast a kill vote.</Alert>)}
            </div>
        );
    }

    const makeRequestToPerformVoteKill = () => {
        Inertia.post(
            '/session/vote-kill',
            {
                slug: slug,
                voteKilledUserEmail: selectedUserToVoteKill.email,
            }
        );
    }

    const getDayScreenForNonGod = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="w-full p-3 text-center">
                    <p className="text-2xl font-extrabold border-b pb-3">Vote Kill</p>
                    <div className="my-6 p-6">
                        <div className="flex flex-col sm:flex-row">
                            {selectedUserToVoteKill ? (
                                <AutocompleteSelect
                                    itemsList={gameMeta.aliveUserData}
                                    selectedValue={selectedUserToVoteKill}
                                    itemLabelKey="name"
                                    setSelectedValue={(val) => {setSelectedUserToVoteKill(val)}}
                                    placeholder="Select person to vote kill"
                                    customClasses="w-full flex-grow"
                                />
                            ) : ''}
                            <Button className="ml-2 bg-blue-500 hover:bg-blue-600 text white text-center mt-2 sm:mt-0" onClick={makeRequestToPerformVoteKill}>
                                    <span className="inline-block mx-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-full p-3 md:mt-0">
                    <div className="rounded p-3 border">
                        <p className="my-4 text-2xl">Vote Kill Data</p>
                        {gameMeta.killVoteData ? (
                        <ul>
                            {gameMeta.killVoteData.map((vote) => {
                                return (
                                    <li className="border p-3 m-3 text-center" key={vote.name}>
                                        {vote.name} : <span className="font-extrabold">{vote.totalVotes}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        ) : (<Alert severity="info">No one has cast a kill vote.</Alert>)}
                    </div>
                </div>
            </div>
        );
    }
    const getInProgressContent = () => {
        if (gameTime === 'Night') {
            switch (role) {
                case 'mafia':
                    return getInProgressContentForMafia();
                case 'doctor':
                    return getInProgressContentForDoctor();
                case 'sheriff':
                    return getInProgressContentForSheriff();
                case 'god':
                    return getInProgressContentForGod();
            }
        } else {
            switch (role) {
                case 'god':
                    return getDayScreenForGod();
                default:
                    return getDayScreenForNonGod();
            }
        }
    }

    const makeRequestToBringInMorning = () => {
        Inertia.post(
            '/session/declare-morning',
            {
                slug: slug
            }
        );
    }

    const makeRequestToBringInNight = () => {
        Inertia.post(
            '/session/declare-night',
            {
                slug: slug
            }
        );
    }

    return (
        <>
            {getInProgressHeaderContent()}
            <div className="p-4">
                <div className="mt-4">
                    <img src={`/storage/images/${gameTime === 'Night' ? 'night' : 'sun'}.png`} alt={gameTime === 'Night' ? 'Night Time Image' : 'Daytime Image'} style={{width: '2rem'}} className="inline-block mr-2 align-bottom"/>
                    <span className="text-2xl font-extrabold">{gameTime === 'Night' ? 'Night Time' : 'Daytime'}</span>
                </div>
                <div className="mt-8 font-extrabold text-xl">Round: {roundNumber}</div>
                {gameTime === 'Day' ? (
                    <Alert severity={gameMeta.nightResult.status === 'Saved' ? 'success' : 'error'} className="my-4">
                        {gameMeta.nightResult.status === 'Saved' ? "No one was killed!" : `${gameMeta.nightResult.name} was killed brutally.`}
                    </Alert>
                ) : ''}
                {getInProgressContent()}
                {gameTime === 'Night' && role === 'god' && gameMeta.progress.mafia === 'done' && gameMeta.progress.doctor === 'done' && gameMeta.progress.sheriff === 'done' ? (
                    <Button className="ml-2 bg-blue-500 hover:bg-blue-600 text white text-center mt-2 sm:mt-0" onClick={makeRequestToBringInMorning}>
                        Declare result and bring in morning
                    </Button>
                ) : ''}
                {gameTime === 'Day' && role === 'god' ? (
                    <Button className="ml-2 bg-blue-500 hover:bg-blue-600 text white text-center mt-8" onClick={makeRequestToBringInNight}>
                        Declare result and bring in Night
                    </Button>
                ) : ''}
            </div>
        </>
    );
}
