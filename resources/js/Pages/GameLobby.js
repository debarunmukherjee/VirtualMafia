import React, {useState} from 'react';
import {Head, usePage} from "@inertiajs/inertia-react";
import Authenticated from "@/Layouts/Authenticated";
import UserInviteList from "@/Components/UserInviteList";
import Button from "@/Components/Button";
import {validateEmail} from "@/Utils/Common";
import {Inertia} from "@inertiajs/inertia";
import PreStart from "@/Pages/GameScreens/PreStart";
import InProgress from "@/Pages/GameScreens/InProgress";
import GameEnded from "@/Pages/GameScreens/GameEnded";

export default function GameLobby(props) {
    const {sessionDetails} = usePage().props;
    const getGameScreen = () => {
        if (!Number(sessionDetails.is_started)) {
            return <PreStart/>
        }
        if (Number(sessionDetails.is_started) && !Number(sessionDetails.is_ended)) {
            return <InProgress/>
        }
        return <GameEnded/>
    }
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    <img src="/storage/images/multiplayer.png" alt="Host Virtual Mafia Session Image" style={{width: '2rem'}} className="inline-block mr-2 align-bottom"/>
                    Ongoing Games / {sessionDetails.name}
                </h2>
            }
        >
            <Head title="Session Name - Lobby" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {getGameScreen()}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
