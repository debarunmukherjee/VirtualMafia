import React from 'react';
import {InertiaLink, usePage} from "@inertiajs/inertia-react";
import Authenticated from "@/Layouts/Authenticated";
import {Alert} from "@material-ui/lab";
import Button from "@/Components/Button";

export default function OngoingGames() {
    const props = usePage().props;
    const { ongoingGames } = props;

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ongoing Games</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {ongoingGames.length > 0 ? (
                                <ul>
                                    {ongoingGames.map((game) => (
                                        <li className="mt-4 xs:flex xs:flex-row flex-col border border-gray-300 shadow-md p-4" key={game.slug}>
                                            <div className="md:w-2/12 flex items-center font-extrabold align-middle">
                                                <span>{game.name}</span>
                                            </div>
                                            <div className="md:w-10/12 inline-block xs:pl-8">
                                                <InertiaLink href={`/lobby/${game.slug}`}>
                                                    <Button className="hover:bg-blue-500 bg-blue-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                                        </svg>
                                                    </Button>
                                                </InertiaLink>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (<Alert severity="info">You are not a part of any ongoing game</Alert>)}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
